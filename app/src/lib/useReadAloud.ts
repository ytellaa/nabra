import { useCallback, useEffect, useRef, useState } from 'react';
import { speaker } from './speech';
import { sentenceChunks, type Word } from './words';

/** Délai de base par mot à vitesse 1x (maquette), utilisé si la voix ne donne pas la position. */
export const BASE_WORD_MS = 420;

const wordMs = (w: Word, rate: number) => (BASE_WORD_MS / rate) * Math.min(2.2, Math.max(0.7, w.text.length / 5));

/**
 * Moteur de lecture karaoké : lit phrase par phrase et suit le mot en cours.
 * Si la voix ne signale pas la position des mots, un minuteur estime l'avancée.
 */
export function useReadAloud(words: Word[], text: string, speed: number, onFinish: () => void) {
  const [idx, setIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const token = useRef(0);
  const idxRef = useRef(-1);
  const speedRef = useRef(speed);
  const finishRef = useRef(onFinish);
  useEffect(() => {
    speedRef.current = speed;
    finishRef.current = onFinish;
  });

  const setIndex = (i: number) => {
    idxRef.current = i;
    setIdx(i);
  };

  const stop = useCallback(() => {
    token.current++;
    speaker.stop();
    setPlaying(false);
  }, []);

  const play = useCallback(
    async (from?: number) => {
      speaker.stop();
      const my = ++token.current;
      const alive = () => token.current === my;
      const rate = speedRef.current;
      const cur = idxRef.current;
      const start = from ?? (cur < 0 || cur >= words.length - 1 ? 0 : cur);
      if (!words.length) return;
      setPlaying(true);
      setIndex(start);

      for (const [a, b] of sentenceChunks(words, start)) {
        if (!alive()) return;
        let at = a;
        const advance = (i: number) => {
          if (alive() && i > at && i <= b) {
            at = i;
            setIndex(i);
          }
        };
        setIndex(a);
        const timers: ReturnType<typeof setTimeout>[] = [];
        const runTimer = (onDone?: () => void) => {
          const step = () => {
            if (!alive() || gotBoundary) return;
            if (at >= b) {
              if (onDone) timers.push(setTimeout(onDone, wordMs(words[b], rate)));
              return;
            }
            timers.push(setTimeout(() => (advance(at + 1), step()), wordMs(words[at], rate)));
          };
          step();
        };
        let gotBoundary = false;

        if (speaker.available()) {
          const base = words[a].start;
          const chunkText = text.slice(base, words[b].end);
          // Sans position de mot après 700 ms, on estime l'avancée au minuteur.
          timers.push(setTimeout(() => !gotBoundary && runTimer(), 700));
          await speaker.speak(chunkText, rate, (ci) => {
            gotBoundary = true;
            const abs = base + ci;
            let k = a;
            while (k < b && words[k + 1].start <= abs) k++;
            advance(k);
          });
        } else {
          await new Promise<void>((resolve) => {
            runTimer(resolve);
            const check = setInterval(() => !alive() && (clearInterval(check), resolve()), 200);
            timers.push(check as unknown as ReturnType<typeof setTimeout>);
          });
        }
        timers.forEach(clearTimeout);
        if (!alive()) return;
        advance(b);
      }
      if (alive()) {
        setPlaying(false);
        finishRef.current();
      }
    },
    [words, text],
  );

  const reset = useCallback(() => {
    stop();
    setIndex(-1);
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return { idx, playing, play, pause: stop, reset };
}
