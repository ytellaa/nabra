import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { lookupWord, needsAutoLookup, requestConfig } from './dictionary';
import { PARSER_VERSION } from './wiktionary';

const page = (wikitext: string, title = 'mot') => ({ parse: { title, wikitext } });
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const PAIN = '== {{langue|fr}} ==\n=== {{S|nom|fr}} ===\n# Aliment.\n==== {{S|traductions}} ====\n* {{T|ar}} : {{trad+|ar|خبز}}';
const LISONS = '== {{langue|fr}} ==\n=== {{S|verbe|fr|flexion}} ===\n{{fr-verbe-flexion|lire|grp=3}}\n# Forme de [[lire]].';
const LIRE = '== {{langue|fr}} ==\n=== {{S|verbe|fr}} ===\n# Comprendre un texte écrit.';

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  requestConfig.minGapMs = 0;
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('lookupWord', () => {
  it('mot trouvé : définition et traduction', async () => {
    fetchMock.mockResolvedValueOnce(json(page(PAIN, 'pain')));
    const r = await lookupWord('pain', 'pain');
    expect(r.status).toBe('ok');
    expect(r.entries[0].senses).toEqual(['Aliment.']);
    expect(r.entries[0].translations).toEqual(['خبز']);
    expect(r.page).toBe('pain');
    expect(r.parserVersion).toBe(PARSER_VERSION);
  });

  it('forme fléchie : seconde requête pour la forme de base', async () => {
    fetchMock.mockResolvedValueOnce(json(page(LISONS, 'lisons'))).mockResolvedValueOnce(json(page(LIRE, 'lire')));
    const r = await lookupWord('lisons', 'lisons');
    expect(r).toMatchObject({ status: 'ok', lemma: 'lire', page: 'lire' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('forme de base inaccessible : forme connue, statut à réessayer', async () => {
    fetchMock.mockResolvedValueOnce(json(page(LISONS, 'lisons'))).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const r = await lookupWord('lisons', 'lisons');
    expect(r).toMatchObject({ status: 'offline', lemma: 'lire' });
  });

  it('réseau coupé → offline', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    expect((await lookupWord('pain', 'pain')).status).toBe('offline');
  });

  it('délai dépassé (requête annulée) → offline', async () => {
    fetchMock.mockRejectedValue(new DOMException('The operation was aborted.', 'AbortError'));
    expect((await lookupWord('pain', 'pain')).status).toBe('offline');
  });

  it.each([429, 500, 503])('HTTP %i → busy', async (code) => {
    fetchMock.mockImplementation(async () => new Response('Too many requests', { status: code }));
    expect((await lookupWord('pain', 'pain')).status).toBe('busy');
  });

  it('JSON invalide → offline, sans exception', async () => {
    fetchMock.mockResolvedValue(new Response('<html>erreur</html>', { status: 200 }));
    expect((await lookupWord('pain', 'pain')).status).toBe('offline');
  });

  it('page absente : essaie la forme écrite, puis not-found', async () => {
    fetchMock.mockImplementation(async () => json({ error: { code: 'missingtitle' } }));
    const r = await lookupWord('paris', 'Paris');
    expect(r.status).toBe('not-found');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1][0])).toContain('page=Paris');
  });

  it('page sans section française → not-found', async () => {
    fetchMock.mockResolvedValue(json(page('== {{langue|en}} ==\n=== {{S|nom|en}} ===\n# Computer.')));
    expect((await lookupWord('computer', 'computer')).status).toBe('not-found');
  });

  it('format changé (rien d’exploitable) → unreadable', async () => {
    fetchMock.mockResolvedValue(json(page('== {{langue|fr}} ==\nNouveau format inconnu')));
    const r = await lookupWord('pain', 'pain');
    expect(r).toMatchObject({ status: 'unreadable', page: 'mot' });
  });

  it('réponse sans wikitext → unreadable', async () => {
    fetchMock.mockResolvedValue(json({ parse: { title: 'pain' } }));
    expect((await lookupWord('pain', 'pain')).status).toBe('unreadable');
  });

  it('envoie seulement le mot, avec l’identification demandée par Wikimedia', async () => {
    fetchMock.mockResolvedValueOnce(json(page(PAIN, 'pain')));
    await lookupWord('pain', 'pain');
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/^https:\/\/fr\.wiktionary\.org\/w\/api\.php\?/);
    expect(url).toContain('page=pain');
    expect((init.headers as Record<string, string>)['Api-User-Agent']).toMatch(/^Nabra\//);
  });
});

describe('needsAutoLookup', () => {
  const info = (status: 'ok' | 'offline' | 'busy' | 'not-found' | 'unreadable', parserVersion = PARSER_VERSION) => ({
    status,
    entries: [],
    fetchedAt: 0,
    parserVersion,
  });
  it.each([
    ['jamais cherché', undefined, true],
    ['réussi', info('ok'), false],
    ['hors connexion', info('offline'), true],
    ['service occupé (manuel seulement)', info('busy'), false],
    ['introuvable', info('not-found'), false],
    ['illisible, même lecteur', info('unreadable'), false],
    ['illisible, lecteur plus ancien', info('unreadable', PARSER_VERSION - 1), true],
  ])('%s → %s', (_, i, expected) => {
    expect(needsAutoLookup(i)).toBe(expected);
  });
});
