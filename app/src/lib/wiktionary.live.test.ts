import { describe, expect, it } from 'vitest';
import { lookupWord } from './dictionary';

/**
 * Vérification en direct du format du Wiktionnaire (réseau réel), lancée à la main avant une release :
 * `npm run check:wiktionary`. Ignorée par `npm test`.
 */
const LIVE = import.meta.env.VITE_WIKTIONARY_LIVE === '1';

describe.skipIf(!LIVE)('Wiktionnaire en direct', () => {
  it.each([
    ['pain', 'خبز'],
    ['maison', 'منزل'],
    ['médicament', null],
    ['lisons', null],
  ])('« %s » est toujours lisible', { timeout: 30000 }, async (word, ar) => {
    const r = await lookupWord(word, word);
    expect(r.status).toBe('ok');
    expect(r.entries[0].senses.length).toBeGreaterThan(0);
    if (ar) expect(r.entries.flatMap((e) => e.translations)).toContain(ar);
    if (word === 'lisons') expect(r.lemma).toBe('lire');
  });
});
