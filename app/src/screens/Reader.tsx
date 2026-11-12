import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context';
import { BackButton, Parrot } from '../components/ui';
import { useReadAloud } from '../lib/useReadAloud';
import type { Word } from '../lib/words';
import type { TKey } from '../i18n';

const SPEEDS: Array<{ value: number; key: TKey }> = [
  { value: 0.5, key: 'reader.speed.slow' },
  { value: 0.8, key: 'reader.speed.medium' },
  { value: 1, key: 'reader.speed.normal' },
];

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
}

export function Reader({ words, text, fromCapture, autoPlay, speed, onSpeed, onBack, onRescan, onStart, onFinish }: Props) {
  const { t, sound } = useApp();
  const doubtCount = fromCapture ? words.filter((w) => w.doubtful).length : 0;
  const [showBanner, setShowBanner] = useState(doubtCount > 0);
  const { idx, playing, play, pause } = useReadAloud(words, text, speed, onFinish);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const reading = idx >= 0;

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

      {showBanner && (
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
          if (w.doubtful && fromCapture && !(reading && i === idx)) cls.push('doubt');
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
              onClick={() => {
                sound('son-mot');
                start(i);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  start(i);
                }
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
      <div className="hint">{t('reader.tapHint')}</div>

      <div className="speeds" role="radiogroup" aria-label={t('reader.speed')}>
        {SPEEDS.map((s) => (
          <button
            key={s.value}
            type="button"
            role="radio"
            aria-checked={speed === s.value}
            className={`speed${speed === s.value ? ' active' : ''}`}
            onClick={() => onSpeed(s.value)}
          >
            <span className="name">{t(s.key)}</span>
            <span className="val" dir="ltr">
              {String(s.value).replace('.', ',')}x
            </span>
          </button>
        ))}
      </div>

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
    </main>
  );
}
