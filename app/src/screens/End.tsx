import { House, RotateCcw } from 'lucide-react';
import { useApp } from '../context';
import { Parrot } from '../components/ui';

export function End({ wordCount, onReplay, onHome }: { wordCount: number; onReplay: () => void; onHome: () => void }) {
  const { t } = useApp();
  return (
    <main className="screen end-screen">
      <div className="end-center" role="status">
        <Parrot pose="bravo" size={240} bg="#fff" />
        <div className="bravo">{t('end.bravo')}</div>
        <div className="words-pill">{t('end.wordsRead', { n: wordCount })}</div>
      </div>
      <button type="button" className="big-btn secondary" onClick={onReplay}>
        <RotateCcw size={26} strokeWidth={2.2} aria-hidden="true" />
        {t('end.replay')}
      </button>
      <button type="button" className="big-btn secondary outline" onClick={onHome}>
        <House size={26} strokeWidth={2.2} aria-hidden="true" />
        {t('common.home')}
      </button>
    </main>
  );
}
