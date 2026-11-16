/**
 * Lecture du texte source (wikitext) d'une page du Wiktionnaire français.
 * Fonctions pures et tolérantes : une page inattendue donne un résultat vide, jamais une exception.
 * Incrémenter PARSER_VERSION à chaque correction : les mots « illisibles » seront recherchés à nouveau.
 */
export const PARSER_VERSION = 1;

const MAX_SENSES = 8;
const MAX_SENSE_LENGTH = 300;
const MAX_TRANSLATIONS = 5;

export interface DictEntry {
  /** Nature du mot (« nom », « verbe »…). */
  pos: string;
  senses: string[];
  /** Traductions en arabe. */
  translations: string[];
}

export interface ParsedPage {
  /** 'missing' : pas de section française ; 'unreadable' : section française sans rien d'exploitable. */
  status: 'ok' | 'missing' | 'unreadable';
  entries: DictEntry[];
  /** Formes de base quand la page n'est qu'une forme fléchie (« lisons » → « lire »). */
  lemmas: string[];
}

/** Sections qui ne décrivent pas une nature de mot. */
const NON_POS = new Set([
  'étymologie', 'prononciation', 'anagrammes', 'voir aussi', 'références', 'homophones', 'paronymes',
  'synonymes', 'antonymes', 'dérivés', 'apparentés', 'vocabulaire', 'phrases', 'traductions',
  'hyperonymes', 'hyponymes', 'méronymes', 'holonymes', 'variantes', 'variantes orthographiques',
  'abréviations', 'quasi-synonymes', 'dérivés autres langues', 'traductions à trier', 'note', 'notes',
  'attestations', 'troponymes', 'faux-amis', 'compos', 'composés', 'gentilés', 'diminutifs',
  'augmentatifs', 'expressions', 'proverbes', 'citations', 'transcriptions', 'hist', 'syn', 'ant',
  'trad', 'pron', 'étym', 'réf', 'voir', 'apr', 'drv', 'voc', 'hyper', 'hypo', 'var', 'anagr',
]);

/** Libellés lisibles pour les abréviations courantes du modèle {{S|…}}. */
const POS_LABELS: Record<string, string> = {
  adj: 'adjectif',
  adv: 'adverbe',
  conj: 'conjonction',
  prép: 'préposition',
  pronom: 'pronom',
  'nom-pr': 'nom propre',
  'loc-phr': 'locution-phrase',
  interj: 'interjection',
  'adj-num': 'adjectif numéral',
  'art-déf': 'article défini',
  'art-indéf': 'article indéfini',
  'pronom-pers': 'pronom personnel',
  'pronom-dém': 'pronom démonstratif',
  'pronom-rel': 'pronom relatif',
  'pronom-int': 'pronom interrogatif',
  'adj-dém': 'adjectif démonstratif',
  'adj-pos': 'adjectif possessif',
};

/** Retire les diacritiques arabes (voyelles brèves…) pour dédoublonner « خبز » et « خُبْز ». */
const stripHarakat = (s: string) => s.replace(/[ً-ٰٟ]/g, '');

/** Texte lisible d'une ligne de définition : sans modèles, liens, gras, italique ni balises. */
export function cleanWikitext(line: string): string {
  let s = line.replace(/<ref[^>]*\/>/g, '').replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  // Modèles imbriqués : on retire les plus internes jusqu'à disparition (borne de sécurité).
  for (let i = 0; i < 10 && /\{\{[^{}]*\}\}/.test(s); i++) s = s.replace(/\{\{[^{}]*\}\}/g, '');
  // Images et catégories : retirées avec leur légende (qui peut contenir des liens).
  s = s.replace(/\[\[(?:Fichier|File|Image|Catégorie|Category):(?:[^[\]]|\[\[[^\]]*\]\])*\]\]/gi, '');
  s = s
    .replace(/\{\{|\}\}/g, '')
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
    .replace(/\[https?:\/\/\S+\s([^\]]+)\]/g, '$1')
    .replace(/'''?/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,;:.)]+/, '')
    .replace(/\(\s*\)/g, '')
    .trim();
  if (s.length > MAX_SENSE_LENGTH) s = s.slice(0, MAX_SENSE_LENGTH - 1).trimEnd() + '…';
  return s;
}

/** Section `== {{langue|fr}} ==` (jusqu'à la langue suivante), ou null. */
export function frenchSection(wikitext: string): string | null {
  const start = wikitext.search(/^==\s*\{\{langue\|fr\}\}\s*==\s*$/m);
  if (start < 0) return null;
  const rest = wikitext.slice(start + 2);
  const next = rest.search(/^==[^=]/m);
  return next < 0 ? wikitext.slice(start) : wikitext.slice(start, start + 2 + next);
}

/** Lit une page : natures, sens, traductions arabes et formes de base. Ne lève jamais d'exception. */
export function parseWikitext(wikitext: unknown): ParsedPage {
  try {
    if (typeof wikitext !== 'string') return { status: 'unreadable', entries: [], lemmas: [] };
    const fr = frenchSection(wikitext);
    if (fr === null) return { status: 'missing', entries: [], lemmas: [] };

    const entries: DictEntry[] = [];
    const lemmas: string[] = [];
    // Découpage en sections de niveau 3 (=== {{S|nom|fr}} ===) ; les sous-sections (traductions) restent dedans.
    const parts = fr.split(/^(?====[^=])/m);
    for (const part of parts) {
      const head = part.match(/^===\s*\{\{S\|([^|}]+)((?:\|[^}]*)?)\}\}\s*===/);
      if (!head) continue;
      const code = head[1].trim().toLowerCase();
      if (NON_POS.has(code)) continue;
      const params = head[2] ?? '';
      const isFlexion = /\|\s*flexion\b/.test(params);
      const defLines = part.split('\n').filter((l) => /^#(?![*:#])/.test(l));

      if (isFlexion) {
        const tpl = part.match(/\{\{fr-verbe-flexion\|(?:[^|}]*=[^|}]*\|)*([^|}=]+)[|}]/);
        const link = defLines.map((l) => l.match(/\[\[([^\]|#]+)/)?.[1]).find(Boolean);
        const lemma = (tpl?.[1] ?? link ?? '').trim();
        if (lemma && !lemmas.includes(lemma)) lemmas.push(lemma);
        continue;
      }

      const senses = defLines
        .map((l) => cleanWikitext(l.replace(/^#\s*/, '')))
        .filter((s) => s.length > 1)
        .slice(0, MAX_SENSES);
      const translations: string[] = [];
      const seen = new Set<string>();
      for (const m of part.matchAll(/\{\{trad[+-]{0,2}\|ar\|([^|}]+)/g)) {
        const t = m[1].trim();
        const k = stripHarakat(t);
        if (t && !seen.has(k)) {
          seen.add(k);
          translations.push(t);
        }
        if (translations.length >= MAX_TRANSLATIONS) break;
      }
      if (senses.length) entries.push({ pos: POS_LABELS[code] ?? code, senses, translations });
    }

    if (!entries.length && !lemmas.length) return { status: 'unreadable', entries: [], lemmas: [] };
    return { status: 'ok', entries, lemmas };
  } catch {
    return { status: 'unreadable', entries: [], lemmas: [] };
  }
}
