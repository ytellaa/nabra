import { describe, expect, it } from 'vitest';
import { cleanWikitext, parseWikitext } from './wiktionary';

/**
 * Pages réelles du Wiktionnaire (texte source), enregistrées le 2026-11-16.
 * Contenu sous licence CC BY-SA 4.0, auteurs : contributeurs du Wiktionnaire (fr.wiktionary.org).
 */
const pages = import.meta.glob<string>('./__fixtures__/wiktionary/*.txt', { query: '?raw', import: 'default', eager: true });
const fixture = (word: string) => {
  const p = pages[`./__fixtures__/wiktionary/${word}.txt`];
  if (p === undefined) throw new Error(`Page enregistrée manquante : ${word}`);
  return p;
};
const names = Object.keys(pages).map((k) => k.replace(/^.*\/(.*)\.txt$/, '$1'));
const allTranslations = (word: string) => parseWikitext(fixture(word)).entries.flatMap((e) => e.translations);

describe('pages enregistrées', () => {
  it('il y a assez de pages pour détecter un changement de format', () => {
    expect(names.length).toBeGreaterThanOrEqual(60);
  });

  it.each(names)('« %s » est lu sans erreur ni reste de syntaxe wiki', (name) => {
    const p = parseWikitext(fixture(name));
    expect(['ok', 'missing']).toContain(p.status);
    for (const e of p.entries) {
      expect(e.pos).not.toBe('');
      for (const s of e.senses) {
        expect(s).not.toMatch(/\{\{|\}\}|\[\[|\]\]|'''|<\w|thumb\|/);
        expect(s.length).toBeLessThanOrEqual(300);
      }
      expect(e.translations.length).toBeLessThanOrEqual(5);
    }
  });

  it('la plupart des mots courants ont une traduction arabe', () => {
    const lemmas = names.filter((n) => parseWikitext(fixture(n)).entries.length);
    const translated = lemmas.filter((n) => allTranslations(n).length);
    expect(translated.length / lemmas.length).toBeGreaterThan(0.6);
  });
});

describe('contenu attendu', () => {
  it('pain : définition et traduction', () => {
    const p = parseWikitext(fixture('pain'));
    expect(p.status).toBe('ok');
    expect(p.entries[0].pos).toBe('nom');
    expect(p.entries[0].senses[0]).toMatch(/^Pâte cuite au four/);
    expect(allTranslations('pain')).toContain('خبز');
  });

  it('maison : traductions sans doublon de voyelles', () => {
    expect(allTranslations('maison')).toEqual(expect.arrayContaining(['بيت', 'منزل']));
  });

  it('formes fléchies : renvoi vers la forme de base', () => {
    for (const [form, lemma] of [
      ['lisons', 'lire'],
      ['mangeaient', 'manger'],
    ]) {
      const p = parseWikitext(fixture(form));
      expect(p.status).toBe('ok');
      expect(p.entries).toEqual([]);
      expect(p.lemmas[0]).toBe(lemma);
    }
  });

  it('mot à la fois nom et forme fléchie : le nom est gardé', () => {
    const p = parseWikitext(fixture('facture'));
    expect(p.entries[0].pos).toBe('nom');
    expect(p.lemmas).toContain('facturer');
  });

  it('faire : la légende d’image ne pollue pas la définition', () => {
    expect(parseWikitext(fixture('faire')).entries[0].senses[0]).not.toMatch(/thumb|Fichier/);
  });
});

describe('pages inattendues (format changé, réponse invalide)', () => {
  it.each([
    ['vide', '', 'missing'],
    ['sans section française', '== {{langue|en}} ==\n=== {{S|nom|en}} ===\n# A thing.', 'missing'],
    ['section française sans nature', '== {{langue|fr}} ==\n=== {{S|étymologie}} ===\n: Du latin.', 'unreadable'],
    ['nature sans définition', '== {{langue|fr}} ==\n=== {{S|nom|fr}} ===\nRien ici.', 'unreadable'],
    ['ancien format de titres', '== Français ==\n=== Nom commun ===\n# Un objet.', 'missing'],
  ])('%s → %s', (_, text, status) => {
    expect(parseWikitext(text).status).toBe(status);
  });

  it.each([null, undefined, 42, {}, ['== {{langue|fr}} ==']])('valeur non textuelle (%j) → illisible', (v) => {
    expect(parseWikitext(v).status).toBe('unreadable');
  });

  it('modèles mal fermés ou très imbriqués : pas d’exception', () => {
    const nested = '{{a|'.repeat(50) + 'x' + '}}'.repeat(10);
    const text = `== {{langue|fr}} ==\n=== {{S|nom|fr}} ===\n# Début ${nested} [[lien|fin\n# Sens valide.`;
    expect(() => parseWikitext(text)).not.toThrow();
    expect(parseWikitext(text).entries[0].senses).toContain('Sens valide.');
  });

  it('page énorme : traitée sans exception', () => {
    const huge = '== {{langue|fr}} ==\n=== {{S|nom|fr}} ===\n' + '# Sens.\n'.repeat(20000);
    const p = parseWikitext(huge);
    expect(p.entries[0].senses.length).toBeLessThanOrEqual(8);
  });

  it('balises HTML et scripts : retirés du texte', () => {
    const p = parseWikitext('== {{langue|fr}} ==\n=== {{S|nom|fr}} ===\n# <script>alert(1)</script>Texte <b>gras</b>.');
    expect(p.entries[0].senses[0]).toBe('alert(1)Texte gras.');
  });
});

describe('cleanWikitext', () => {
  it.each([
    ["[[pâte|Pâte]] [[cuire|cuite]] au [[four]]", 'Pâte cuite au four'],
    ["{{lexique|art|fr}} [[fabrication|Fabrication]] des [[instrument]]s", 'Fabrication des instruments'],
    ["''Première personne du pluriel de'' [[lire]].", 'Première personne du pluriel de lire.'],
    ['Texte<ref>Source</ref> suite', 'Texte suite'],
  ])('%s', (input, out) => {
    expect(cleanWikitext(input)).toBe(out);
  });
});
