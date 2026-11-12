import { Camera, Settings } from 'lucide-react';
import { useApp } from '../context';
import { formatDay } from '../i18n';
import type { Session } from '../lib/db';
import { titleOf } from '../lib/words';
import { Bubble, Parrot } from '../components/ui';
import { TINTS } from '../lib/tints';


interface Props {
  sessions: Session[];
  totalWords: number;
  onToggleLang: () => void;
  onSettings: () => void;
  onNewRead: () => void;
  onOpen: (s: Session) => void;
}

export function Home({ sessions, totalWords, onToggleLang, onSettings, onNewRead, onOpen }: Props) {
  const { t, lang } = useApp();
  const hasHistory = sessions.length > 0;

  return (
    <main className="screen">
      <header className="row home-header">
        <img className="logo" src="/assets/images/logo.svg" alt="Nabra" />
        <div className="row" style={{ gap: 8 }}>
          <button
            type="button"
            className="lang-btn"
            onClick={onToggleLang}
            lang={lang === 'fr' ? 'ar' : 'fr'}
            style={{ fontFamily: lang === 'fr' ? 'var(--font-arabic)' : 'var(--font-latin)' }}
          >
            {t('home.otherLang')}
          </button>
          <button type="button" className="icon-btn small" onClick={onSettings} aria-label={t('home.settings')} title={t('home.settings')}>
            <Settings size={22} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </header>

      {!hasHistory ? (
        <div className="home-first">
          <Bubble big>{t('home.firstMsg')}</Bubble>
          <Parrot pose="salue" size={220} />
        </div>
      ) : (
        <>
          <div className="row" style={{ gap: 14 }}>
            <Parrot pose="salue" size={92} />
            <Bubble>{t('home.ready')}</Bubble>
          </div>
          <div className="counter">
            <span className="label">{t('home.wordsRead')}</span>
            <span className="value" dir="ltr">
              {totalWords}
            </span>
          </div>
          <h2 className="section-label" style={{ margin: 0 }}>
            {t('home.myReads')}
          </h2>
          <ul className="history" style={{ listStyle: 'none', margin: 0 }}>
            {sessions.map((s) => (
              <li key={s.id} style={{ display: 'contents' }}>
                <button type="button" className="history-item" onClick={() => onOpen(s)}>
                  <div className="thumb" style={{ background: TINTS[s.tint % TINTS.length] }}>
                    <img src={s.imageUri ?? '/assets/images/vignette-defaut.svg'} alt="" />
                  </div>
                  <div className="info">
                    <div className="title" dir="ltr" lang="fr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      {titleOf(s.text)}
                    </div>
                    <div className="meta">
                      {formatDay(s.createdAt, lang)} · {t('common.words', { n: s.wordCount })}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <button type="button" className="big-btn" onClick={onNewRead}>
        <Camera size={30} strokeWidth={2} aria-hidden="true" />
        {t('home.newRead')}
      </button>
    </main>
  );
}
