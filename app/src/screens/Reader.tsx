import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { useApp } from '../context';
import { BackButton, Parrot } from '../components/ui';
import { useReadAloud } from '../lib/useReadAloud';
import { myWordOf, type Word } from '../lib/words';
import { SpeedSlider } from '../components/SpeedSlider';
import { WordSheet } from '../components/WordSheet';
import { speaker } from '../lib/speech';

/** Durée d'appui pour ouvrir la fiche du mot, et mouvement toléré (px). */
const LONG_PRESS_MS = 500;
const MOVE_TOLERANCE = 10;

interface Props {
  words: Word[];
  text: string;
  fromCapture: boolean;
  autoPlay: boolean;
  speed: number;
  onSpeed: (v: number) => void;
  onBack: () => void;
  onRescan: () => void;
  /** Appelé au premier ▶ : la session est alors enregistrée. */
  onStart: () => void;
  onFinish: () => void;
  onCorrectWord: (i: number, value: string | null) => void;
  isInMyWords: (text: string) => boolean;
  onAddWord: (i: number) => void;
}

export function Reader({
  words,
  text,
  fromCapture,
  autoPlay,
  speed,
  onSpeed,
  onBack,
  onRescan,
  onStart,
  onFinish,
  onCorrectWord,
  isInMyWords,
  onAddWord,
}: Props) {
  const { t, sound } = useApp();
  const doubtCount = fromCapture ? words.filter((w) => w.doubtful).length : 0;
  const [showBanner, setShowBanner] = useState(doubtCount > 0);
  const { idx, playing, sentence, play, pause } = useReadAloud(words, text, speed, onFinish);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const reading = idx >= 0;
  const [sheet, setSheet] = useState<number | null>(null);
  const press = useRef<{ x: number; y: number; timer: ReturnType<typeof setTimeout>; fired: boolean } | null>(null);

  const openSheet = (i: number) => {
    pause();
    setSheet(i);
    navigator.vibrate?.(15);
  };
  const closeSheet = useCallback(() => setSheet(null), []);

  const onPointerDown = (i: number, e: PointerEvent) => {
    if (e.button !== 0) return;
    if (press.current) clearTimeout(press.current.timer);
    const p = {
      x: e.clientX,
      y: e.clientY,
      fired: false,
      timer: setTimeout(() => {
        p.fired = true;
        openSheet(i);
      }, LONG_PRESS_MS),
    };
    press.current = p;
  };
  const onPointerMove = (e: PointerEvent) => {
    const p = press.current;
    if (p && !p.fired && Math.hypot(e.clientX - p.x, e.clientY - p.y) > MOVE_TOLERANCE) clearTimeout(p.timer);
  };
  const endPress = () => {
    if (press.current) clearTimeout(press.current.timer);
  };

  const start = (from?: number) => {
    setShowBanner(false);
    onStart();
    void play(from);
  };

  useEffect(() => {
    if (autoPlay) start(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Changer de vitesse pendant la lecture continue depuis le mot en cours.
  const firstSpeed = useRef(true);
  useEffect(() => {
    if (firstSpeed.current) {
      firstSpeed.current = false;
      return;
    }
    if (playing) void play(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  useEffect(() => {
    if (idx >= 0) wordRefs.current[idx]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [idx]);

  return (
    <main className="screen reader">
      <div className="row" style={{ justifyContent: 'space-between', gap: 12 }}>
        <BackButton label={t('common.home')} onClick={onBack} />
        <div className="pill" dir="ltr" aria-live="off">
          {reading ? `${idx + 1} / ${words.length}` : t('common.words', { n: words.length })}
        </div>
      </div>

      {showBanner && doubtCount > 0 && (
        <section className="doubt" aria-live="polite">
          <div className="row" style={{ gap: 12 }}>
            <Parrot pose="doute" size={56} bg="#fff" />
            <div className="label">{t('reader.doubt', { n: doubtCount })}</div>
          </div>
          <div className="actions">
            <button type="button" className="rescan" onClick={onRescan}>
              {t('reader.rescan')}
            </button>
            <button type="button" className="anyway" onClick={() => start(0)}>
              {t('reader.readAnyway')}
            </button>
          </div>
        </section>
      )}

      <div className="paper" dir="ltr" lang="fr">
        {words.map((w, i) => {
          const cls = ['word'];
          if (reading && i === idx) cls.push('current');
          else if (reading && i < idx) cls.push('done');
          if (sentence && i >= sentence[0] && i <= sentence[1]) cls.push('in-sentence');
          if (w.doubtful && !(reading && i === idx)) cls.push('doubt');
          return (
            <span
              key={i}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className={cls.join(' ')}
              role="button"
              tabIndex={0}
              aria-current={reading && i === idx ? 'true' : undefined}
              onPointerDown={(e) => onPointerDown(i, e)}
              onPointerMove={onPointerMove}
              onPointerUp={endPress}
              onPointerCancel={endPress}
              onPointerLeave={endPress}
              onContextMenu={(e) => {
                // Appui long Android / clic droit : fiche du mot (une seule fois).
                e.preventDefault();
                if (sheet === null && !press.current?.fired) openSheet(i);
                if (press.current) press.current.fired = true;
              }}
              onClick={() => {
                if (press.current?.fired) {
                  press.current = null;
                  return;
                }
                sound('son-mot');
                start(i);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  start(i);
                } else if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
                  e.preventDefault();
                  openSheet(i);
                }
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
      <div className="hint">{t('reader.tapHint')}</div>

      <SpeedSlider value={speed} onChange={onSpeed} />

      <div className="play-row">
        <Parrot pose="lit" size={72} />
        <button
          type="button"
          className="play-btn"
          aria-label={playing ? t('reader.pause') : t('reader.play')}
          onClick={() => (playing ? pause() : start())}
        >
          {playing ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ marginLeft: 5 }}>
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          )}
        </button>
        <div style={{ width: 72 }} />
      </div>
      {sheet !== null && words[sheet] && (
        <WordSheet
          key={sheet}
          word={words[sheet].text}
          canDelete={words.length > 1}
          inMyWords={isInMyWords(words[sheet].text)}
          onAdd={myWordOf(words[sheet].text) ? () => onAddWord(sheet) : undefined}
          onListen={() => void speaker.speak(words[sheet].text, speed, () => {})}
          onCorrect={(value) => {
            onCorrectWord(sheet, value);
            setSheet(null);
          }}
          onClose={closeSheet}
        />
      )}
    </main>
  );
}
