import { log } from './debug';
import { PARSER_VERSION, parseWikitext, type DictEntry } from './wiktionary';

/**
 * Définition et traduction d'un mot via le Wiktionnaire français (seul accès réseau de Nabra,
 * à la demande, après accord). Rien ne lève d'exception : chaque échec devient un statut.
 */
export type LookupStatus = 'ok' | 'offline' | 'busy' | 'not-found' | 'unreadable';

export interface WordInfo {
  status: LookupStatus;
  /** Forme de base quand le mot gardé est une forme fléchie (« lisons » → « lire »). */
  lemma?: string;
  entries: DictEntry[];
  /** Page consultée (pour le lien « Voir sur le Wiktionnaire »). */
  page?: string;
  fetchedAt: number;
  parserVersion: number;
}

const API = 'https://fr.wiktionary.org/w/api.php';
const TIMEOUT_MS = 8000;
/** Délai minimal entre deux requêtes (politesse envers Wikimedia) ; modifiable par les tests. */
export const requestConfig = { minGapMs: 1200 };
const USER_AGENT = `Nabra/${__APP_VERSION__} (https://github.com/ytellaa/nabra)`;

export const wiktionaryUrl = (page: string) => `https://fr.wiktionary.org/wiki/${encodeURIComponent(page.replace(/ /g, '_'))}`;

type Fetched = { kind: 'ok'; wikitext: unknown; title: string } | { kind: 'missing' } | { kind: 'offline' } | { kind: 'busy' };

let lastRequest = 0;
let queue: Promise<unknown> = Promise.resolve();

/** Une requête à la fois, espacées d'au moins `requestConfig.minGapMs`. */
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const wait = lastRequest + requestConfig.minGapMs - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastRequest = Date.now();
    return task();
  });
  queue = run.catch(() => {});
  return run;
}

async function fetchPage(title: string): Promise<Fetched> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { kind: 'offline' };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const url =
    `${API}?action=parse&format=json&formatversion=2&prop=wikitext&redirects=1&origin=*` +
    `&page=${encodeURIComponent(title)}`;
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'Api-User-Agent': USER_AGENT } });
    if (res.status === 429 || res.status >= 500) {
      log('dict', `Wiktionnaire occupé (${res.status})`, title, 'warn');
      return { kind: 'busy' };
    }
    if (!res.ok) {
      log('dict', `Réponse inattendue (${res.status})`, title, 'warn');
      return { kind: 'busy' };
    }
    const json = (await res.json()) as { parse?: { wikitext?: unknown; title?: string }; error?: { code?: string } };
    if (json?.error?.code === 'missingtitle' || json?.error?.code === 'invalidtitle') return { kind: 'missing' };
    if (json?.error) {
      log('dict', 'Erreur de l’API', json.error, 'warn');
      return { kind: 'busy' };
    }
    return { kind: 'ok', wikitext: json?.parse?.wikitext, title: json?.parse?.title ?? title };
  } catch (e) {
    // Délai dépassé, réseau coupé, JSON invalide…
    log('dict', 'Requête impossible', `${title} ${String((e as Error)?.name ?? e)}`, 'warn');
    return { kind: 'offline' };
  } finally {
    clearTimeout(timer);
  }
}

const result = (status: LookupStatus, rest: Partial<WordInfo> = {}): WordInfo => ({
  status,
  entries: [],
  fetchedAt: Date.now(),
  parserVersion: PARSER_VERSION,
  ...rest,
});

const failure = (f: Fetched): WordInfo => result(f.kind === 'busy' ? 'busy' : f.kind === 'missing' ? 'not-found' : 'offline');

/** Cherche un mot (forme normalisée en minuscules d'abord, puis telle qu'écrite). Ne lève jamais d'exception. */
export async function lookupWord(key: string, text: string): Promise<WordInfo> {
  try {
    const candidates = [...new Set([key, text].filter(Boolean))];
    let page: Fetched = { kind: 'missing' };
    for (const c of candidates) {
      page = await enqueue(() => fetchPage(c));
      if (page.kind !== 'missing') break;
    }
    if (page.kind !== 'ok') return failure(page);

    const parsed = parseWikitext(page.wikitext);
    if (parsed.status === 'missing') return result('not-found');
    if (parsed.status === 'unreadable') {
      log('dict', 'Page illisible (format changé ?)', page.title, 'warn');
      return result('unreadable', { page: page.title });
    }
    if (parsed.entries.length) return result('ok', { entries: parsed.entries, page: page.title });

    // Forme fléchie seule : on cherche la forme de base.
    const lemma = parsed.lemmas[0];
    const base = await enqueue(() => fetchPage(lemma));
    if (base.kind !== 'ok') return { ...failure(base), lemma, page: page.title };
    const parsedBase = parseWikitext(base.wikitext);
    if (!parsedBase.entries.length) {
      log('dict', 'Forme de base illisible', lemma, 'warn');
      return result('unreadable', { lemma, page: base.title });
    }
    return result('ok', { lemma, entries: parsedBase.entries, page: base.title });
  } catch (e) {
    log('dict', 'Erreur inattendue', String(e), 'error');
    return result('unreadable');
  }
}

/** Une recherche automatique est-elle utile pour ce mot (jamais fait, ou échec réessayable) ? */
export function needsAutoLookup(info: WordInfo | undefined): boolean {
  if (!info) return true;
  if (info.status === 'offline') return true;
  if (info.status === 'unreadable') return info.parserVersion < PARSER_VERSION;
  return false;
}
