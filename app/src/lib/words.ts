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

export function wordsFromText(text: string): Word[] {
  return buildWords(text.split(/\s+/).map((t) => ({ text: t }))).words;
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

/** Découpe en phrases (indices de mots) pour lire par morceaux. */
export function sentenceChunks(words: Word[], from: number): Array<[number, number]> {
  const chunks: Array<[number, number]> = [];
  let s = from;
  for (let i = from; i < words.length; i++) {
    const endsSentence = /[.!?…:;]["»”)]*$/.test(words[i].text);
    if (endsSentence || i - s >= 30 || i === words.length - 1) {
      chunks.push([s, i]);
      s = i + 1;
    }
  }
  return chunks;
}
