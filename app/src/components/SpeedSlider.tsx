import { useState } from 'react';
import { Rabbit, Turtle } from 'lucide-react';
import { useApp } from '../context';

const SPEED_MIN = 0.5;
const SPEED_MAX = 1;
const STEP = 0.1;
const STEPS = Math.round((SPEED_MAX - SPEED_MIN) / STEP);

const clamp = (v: number) => Math.min(SPEED_MAX, Math.max(SPEED_MIN, Math.round(v * 10) / 10));
const fmt = (v: number) => v.toFixed(1).replace('.', ',');

/**
 * Barre de vitesse à crans (0,5x à 1x, pas de 0,1), tortue à gauche, lièvre à droite.
 * La valeur n'est transmise qu'au relâchement : chaque changement relance la voix,
 * il ne faut pas la couper pendant le glissement.
 */
export function SpeedSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { t } = useApp();
  // Valeur en cours de glissement ; null = on affiche la valeur enregistrée.
  const [drag, setDrag] = useState<number | null>(null);
  const draft = drag ?? clamp(value);

  const commit = (v = draft) => {
    const c = clamp(v);
    setDrag(null);
    if (c !== value) onChange(c);
  };

  return (
    <div className="speed-slider" dir="ltr">
      <button
        type="button"
        className="speed-end"
        aria-label={t('reader.slower')}
        disabled={draft <= SPEED_MIN}
        onClick={() => commit(draft - STEP)}
      >
        <Turtle size={28} strokeWidth={2} aria-hidden="true" />
      </button>
      <div className="speed-track">
        <input
          type="range"
          min={SPEED_MIN}
          max={SPEED_MAX}
          step={STEP}
          value={draft}
          aria-label={t('reader.speed')}
          aria-valuetext={t('reader.speed.value', { v: fmt(draft) })}
          onChange={(e) => setDrag(clamp(Number(e.target.value)))}
          onPointerUp={() => commit()}
          onTouchEnd={() => commit()}
          onKeyUp={() => commit()}
          onBlur={() => commit()}
        />
        <div className="speed-ticks" aria-hidden="true">
          {Array.from({ length: STEPS + 1 }, (_, i) => (
            <span key={i} className={SPEED_MIN + i * STEP <= draft + 1e-9 ? 'on' : ''} />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="speed-end"
        aria-label={t('reader.faster')}
        disabled={draft >= SPEED_MAX}
        onClick={() => commit(draft + STEP)}
      >
        <Rabbit size={28} strokeWidth={2} aria-hidden="true" />
      </button>
      <span className="speed-val" aria-hidden="true">
        {fmt(draft)}x
      </span>
    </div>
  );
}
