export interface Word {
  text: string;
  start: number;
  end: number;
  doubtful: boolean;
}

export interface RawWord {
  text: string;
  doubtful?: boolean;
}

/** Assemble les mots (OCR ou texte) en un texte unique avec positions de caractères. */
export function buildWords(raw: RawWord[]): { text: string; words: Word[] } {
  const words: Word[] = [];
  let text = '';
  for (const r of raw) {
    const t = r.text.trim();
    if (!t) continue;
    if (text) text += ' ';
    words.push({ text: t, start: text.length, end: text.length + t.length, doubtful: !!r.doubtful });
    text += t;
  }
  return { text, words };
}

/** Mots d'un texte enregistré ; `doubtful` : indices des mots douteux. */
export function wordsFromText(text: string, doubtful: number[] = []): Word[] {
  const set = new Set(doubtful);
  return buildWords(text.split(/\s+/).filter(Boolean).map((t, i) => ({ text: t, doubtful: set.has(i) }))).words;
}

/** Indices des mots douteux (pour l'enregistrement). */
export function doubtfulIndexes(words: Word[]): number[] {
  return words.flatMap((w, i) => (w.doubtful ? [i] : []));
}

/** Remplace le mot `i` par `value` (plusieurs mots si espaces), ou le supprime si `value` est null. */
export function replaceWord(words: Word[], i: number, value: string | null): { text: string; words: Word[] } {
  const raw: RawWord[] = words.map((w) => ({ text: w.text, doubtful: w.doubtful }));
  const repl = value === null ? [] : value.split(/\s+/).filter(Boolean).map((t) => ({ text: t, doubtful: false }));
  raw.splice(i, 1, ...repl);
  return buildWords(raw);
}

/** Les 4 premiers mots suivis de « … ». */
export function titleOf(text: string): string {
  return text.split(/\s+/).filter(Boolean).slice(0, 4).join(' ') + '…';
}

/**
 * Recolle les mots coupés en fin de ligne (« chauf- » + « fe » → « chauffe »).
 * `lines` : liste de lignes, chacune une liste de mots.
 */
export function joinHyphenated(lines: RawWord[][]): RawWord[] {
  const out: RawWord[] = [];
  let carry: RawWord | null = null;
  for (const line of lines) {
    line.forEach((w, i) => {
      let cur = w;
      if (carry && i === 0) {
        cur = { text: carry.text.slice(0, -1) + w.text, doubtful: carry.doubtful || w.doubtful };
        carry = null;
      }
      const isLast = i === line.length - 1;
      if (isLast && /[A-Za-zÀ-ÿ]-$/.test(cur.text)) carry = cur;
      else out.push(cur);
    });
  }
  if (carry) out.push(carry);
  return out;
}

/**
 * Heuristique de mot douteux quand l'OCR ne fournit pas de confiance (ML Kit) :
 * caractères inattendus au milieu d'un mot, mélange chiffres/lettres, etc.
 */
export function looksDoubtful(word: string): boolean {
  const core = word.replace(/^[«"“'([]+|[»"”',.;:!?)\]…]+$/g, '');
  if (!core) return false;
  if (/[^A-Za-zÀ-ÖØ-öø-ÿŒœ0-9'’-]/.test(core)) return true;
  if (/\d/.test(core) && /[A-Za-zÀ-ÿ]/.test(core) && !/^\d+(e|er|ère|ème|h|min)$/i.test(core)) return true;
  if (/[a-zà-ÿ][A-ZÀ-Ý]/.test(core)) return true;
  if (/(.)\1\1/.test(core)) return true;
  return false;
}

/** Abréviations courantes dont le point ne termine pas la phrase. */
const ABBREVIATIONS = new Set(['m', 'mm', 'mme', 'mmes', 'mlle', 'mlles', 'dr', 'pr', 'me', 'st', 'ste', 'cf', 'ex', 'p', 'pp', 'av', 'apr', 'env', 'etc', 'n°', 'no', 'tél', 'vol', 'chap', 'fig']);

function endsSentence(word: string, next: string | undefined): boolean {
  if (!/[.!?…]["»”)]*$/.test(word)) return false;
  if (/[!?…]["»”)]*$/.test(word)) return true;
  const core = word.replace(/^[«"“'([]+/, '').replace(/\.["»”)]*$/, '');
  const abbrev = ABBREVIATIONS.has(core.toLowerCase()) || /^[A-ZÀ-Ý]$/.test(core) || /^([A-Za-z]\.)+[A-Za-z]$/.test(core);
  if (!abbrev) return true;
  // « etc. » en fin de phrase : la suivante commence par une majuscule.
  return core.toLowerCase() === 'etc' && !!next && /^[«"“(]?[A-ZÀ-Ý]/.test(next);
}

/** Phrases du texte (indices de mots [début, fin]), calculées depuis le début ; 30 mots au plus par morceau. */
export function sentenceRanges(words: Word[]): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  let s = 0;
  for (let i = 0; i < words.length; i++) {
    if (endsSentence(words[i].text, words[i + 1]?.text) || i - s >= 30 || i === words.length - 1) {
      ranges.push([s, i]);
      s = i + 1;
    }
  }
  return ranges;
}

/** Indice de la phrase qui contient le mot `i` (-1 si hors texte). */
export function rangeIndexOf(ranges: Array<[number, number]>, i: number): number {
  return ranges.findIndex(([a, b]) => i >= a && i <= b);
}

/**
 * Forme d'un mot pour « Mes mots » : sans ponctuation autour ni élision (« l'école » → « école »).
 * Renvoie null si rien ne reste (ponctuation seule, nombre).
 */
export function myWordOf(raw: string): { key: string; text: string } | null {
  const text = raw
    .replace(/^[«"“‘'([¿¡-]+|[»"”’',.;:!?)\]…-]+$/g, '')
    .replace(/^(?:l|d|j|m|n|s|t|c|qu|jusqu|lorsqu|puisqu|quoiqu)['’](?=\S)/i, '');
  if (!text || !/[A-Za-zÀ-ÖØ-öø-ÿŒœ]/.test(text)) return null;
  return { key: text.toLowerCase(), text };
}
