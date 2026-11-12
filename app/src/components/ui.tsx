import { ArrowLeft } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

export type Pose = 'salue' | 'photo' | 'oups' | 'doute' | 'lit' | 'bravo' | 'ok';

export function Parrot({ pose, size, bg, style }: { pose: Pose; size: number; bg?: string; style?: CSSProperties }) {
  return (
    <div className="parrot" style={{ width: size, height: size, background: bg, ...style }} aria-hidden="true">
      <img src={`/assets/images/parrot-${pose}.svg`} alt="" draggable={false} />
    </div>
  );
}

export function BackButton({ label, onClick, dark }: { label: string; onClick: () => void; dark?: boolean }) {
  return (
    <button type="button" className={`icon-btn${dark ? ' on-dark' : ''}`} onClick={onClick} aria-label={label} title={label}>
      <ArrowLeft size={24} strokeWidth={2.2} className="flip-rtl" aria-hidden="true" />
    </button>
  );
}

export function Bubble({ children, big, style }: { children: ReactNode; big?: boolean; style?: CSSProperties }) {
  return (
    <div className={`bubble${big ? ' big' : ''}`} style={style} role="status">
      {children}
    </div>
  );
}
