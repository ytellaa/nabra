import { describe, expect, it } from 'vitest';
import type { MyWord } from './db';
import { unlinkSession } from './history';

const word = (key: string, sessionIds: string[]): MyWord => ({ key, text: key, addedAt: 0, sessionIds });

describe('unlinkSession', () => {
  it('retire la lecture des mots qui la citent, sans toucher aux autres liens', () => {
    const out = unlinkSession([word('pain', ['a', 'b']), word('lait', ['b'])], 'a');
    expect(out).toEqual([word('pain', ['b'])]);
  });

  it('garde un mot même quand il ne cite plus aucune lecture', () => {
    expect(unlinkSession([word('pain', ['a'])], 'a')).toEqual([word('pain', [])]);
  });

  it('ne renvoie rien quand aucun mot ne cite la lecture', () => {
    expect(unlinkSession([word('pain', ['b']), word('lait', [])], 'a')).toEqual([]);
  });

  it('ne modifie pas les mots reçus', () => {
    const words = [word('pain', ['a', 'b'])];
    unlinkSession(words, 'a');
    expect(words[0].sessionIds).toEqual(['a', 'b']);
  });

  it('garde la définition et les autres champs du mot', () => {
    const w: MyWord = { ...word('pain', ['a']), info: { status: 'ok' } as MyWord['info'] };
    expect(unlinkSession([w], 'a')[0].info).toBe(w.info);
  });
});
