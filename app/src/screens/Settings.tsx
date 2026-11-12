import { useState, type SyntheticEvent } from 'react';
import { Bug, Check, ChevronRight, Globe, Scale, ScrollText, Upload, Volume2 } from 'lucide-react';
import { LEGAL, OPEN_SOURCE } from '../legal';
import { DEBUG_AVAILABLE } from '../lib/buildFlags';
import { LogLine, useLogs } from '../components/DebugPanel';
import { clearLogs } from '../lib/debug';
import { useApp } from '../context';
import { BackButton, Bubble, Parrot } from '../components/ui';
import type { Lang } from '../i18n';

export type SettingsPage = 'settings' | 'lang' | 'backup' | 'backupDone' | 'backupError' | 'logs' | 'legal';

interface Props {
  page: SettingsPage;
  soundOn: boolean;
  debugOn: boolean;
  sessionsCount: number;
  totalWords: number;
  exporting: boolean;
  onBack: () => void;
  onNavigate: (p: SettingsPage) => void;
  onToggleSound: () => void;
  onToggleDebug: () => void;
  onShareLogs: () => void;
  onSetLang: (l: Lang) => void;
  onExport: () => void;
}

export function Settings(p: Props) {
  const { t, lang } = useApp();
  const logs = useLogs();
  const title =
    p.page === 'settings'
      ? t('settings.title')
      : p.page === 'lang'
        ? t('settings.language')
        : p.page === 'logs'
          ? t('settings.logs')
          : p.page === 'legal'
            ? t('settings.legal')
            : t('settings.backup');

  return (
    <main className="screen settings">
      <div className="row" style={{ gap: 14 }}>
        <BackButton label={t('common.back')} onClick={p.onBack} />
        <h1 className="settings-title" style={{ margin: 0 }}>
          {title}
        </h1>
      </div>

      {p.page === 'settings' && (
        <>
          <div className="settings-list">
            <button type="button" className="setting-row" onClick={() => p.onNavigate('lang')}>
              <div className="tile" style={{ background: 'var(--sky)' }}>
                <Globe size={22} aria-hidden="true" />
              </div>
              <span className="name">{t('settings.language')}</span>
              <span className="value">{t('settings.languageName')}</span>
              <ChevronRight size={20} className="chevron flip-rtl" aria-hidden="true" />
            </button>

            <div className="setting-row">
              <div className="tile" style={{ background: 'var(--peach)' }}>
                <Volume2 size={22} aria-hidden="true" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="name" id="sounds-label">
                  {t('settings.sounds')}
                </span>
                <span className="desc">{t('settings.soundsDesc')}</span>
              </div>
              <Switch on={p.soundOn} labelledBy="sounds-label" onClick={p.onToggleSound} />
            </div>

            <button type="button" className="setting-row" onClick={() => p.onNavigate('backup')}>
              <div className="tile" style={{ background: 'var(--mint)' }}>
                <Upload size={22} aria-hidden="true" />
              </div>
              <span className="name">{t('settings.backup')}</span>
              <span className="value">{t('settings.export')}</span>
              <ChevronRight size={20} className="chevron flip-rtl" aria-hidden="true" />
            </button>

            <button type="button" className="setting-row" onClick={() => p.onNavigate('legal')}>
              <div className="tile" style={{ background: 'var(--rose)' }}>
                <Scale size={22} aria-hidden="true" />
              </div>
              <span className="name">{t('settings.legal')}</span>
              <ChevronRight size={20} className="chevron flip-rtl" aria-hidden="true" />
            </button>

            {DEBUG_AVAILABLE && (
              <>
                <div className="setting-row">
                  <div className="tile" style={{ background: 'var(--lavender)' }}>
                    <Bug size={22} aria-hidden="true" />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="name" id="debug-label">
                      {t('settings.debug')}
                    </span>
                    <span className="desc">{t('settings.debugDesc')}</span>
                  </div>
                  <Switch on={p.debugOn} labelledBy="debug-label" onClick={p.onToggleDebug} />
                </div>

                {p.debugOn && (
                  <button type="button" className="setting-row" onClick={() => p.onNavigate('logs')}>
                    <div className="tile" style={{ background: 'var(--surface)' }}>
                      <ScrollText size={22} aria-hidden="true" />
                    </div>
                    <span className="name">{t('settings.logs')}</span>
                    <span className="value latin">{logs.length}</span>
                    <ChevronRight size={20} className="chevron flip-rtl" aria-hidden="true" />
                  </button>
                )}
              </>
            )}
          </div>
          <div className="spacer" />
          <div className="version">Nabra · {__APP_VERSION__}</div>
        </>
      )}

      {p.page === 'lang' && (
        <>
          <div className="settings-list" role="radiogroup" aria-label={t('settings.language')}>
            {(['fr', 'ar'] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={lang === l}
                className={`lang-option${lang === l ? ' active' : ''}`}
                onClick={() => p.onSetLang(l)}
              >
                {l === 'fr' ? (
                  <span lang="fr" style={{ fontFamily: 'var(--font-latin)', fontSize: '1.25rem', fontWeight: 600 }}>
                    Français
                  </span>
                ) : (
                  <span lang="ar" dir="rtl" style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.375rem', fontWeight: 600 }}>
                    العربية
                  </span>
                )}
                {lang === l && <Check size={24} strokeWidth={2.5} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <p className="note" style={{ margin: 0 }}>
            {t('settings.languageNote')}
          </p>
        </>
      )}

      {p.page === 'backup' && (
        <>
          <div className="backup-card">
            <div className="summary">{t('settings.backupSummary', { sessions: p.sessionsCount, words: p.totalWords })}</div>
            <div className="desc">{t('settings.backupDesc')}</div>
          </div>
          <div className="spacer" />
          <button type="button" className="big-btn" onClick={p.onExport} disabled={p.exporting} aria-busy={p.exporting}>
            <Upload size={26} strokeWidth={2.2} aria-hidden="true" />
            {t('settings.export')}
          </button>
        </>
      )}

      {p.page === 'legal' && (
        <div className="legal">
          <section className="legal-card">
            <dl>
              <dt>{t('legal.publisher')}</dt>
              <dd>{LEGAL.publisher || <em>{t('legal.toComplete')}</em>}</dd>
              {LEGAL.address && (
                <>
                  <dt>{t('legal.address')}</dt>
                  <dd>{LEGAL.address}</dd>
                </>
              )}
              <dt>{t('legal.contact')}</dt>
              <dd dir="ltr">{LEGAL.contact || <em>{t('legal.toComplete')}</em>}</dd>
              <dt>{t('legal.illustrations')}</dt>
              <dd>{LEGAL.illustrations || <em>{t('legal.toComplete')}</em>}</dd>
              {LEGAL.host && (
                <>
                  <dt>{t('legal.host')}</dt>
                  <dd>{LEGAL.host}</dd>
                </>
              )}
            </dl>
            <p className="legal-note">{t('legal.publisherNote')}</p>
          </section>
          <section className="legal-card">
            <h2>{t('legal.privacyTitle')}</h2>
            <p>{t('legal.privacy')}</p>
            <p>{t('legal.rights')}</p>
          </section>
          <section className="legal-card">
            <h2>{t('legal.permTitle')}</h2>
            <p>{t('legal.perm')}</p>
            <p>{t('legal.permInternet')}</p>
          </section>
          <section className="legal-card">
            <h2>{t('legal.servicesTitle')}</h2>
            <p>{t('legal.services')}</p>
          </section>
          <section className="legal-card">
            <h2>{t('legal.limitsTitle')}</h2>
            <p>{t('legal.limits')}</p>
            <p>{t('legal.warranty')}</p>
          </section>
          <section className="legal-card">
            <h2>{t('legal.ipTitle')}</h2>
            <p>{t('legal.ip')}</p>
            <p>{t('legal.texts')}</p>
            <p>{t('legal.trademarks')}</p>
          </section>
          <section className="legal-card">
            <h2>{t('legal.licenseTitle')}</h2>
            <p>{t('legal.license')}</p>
            {LEGAL.sourceUrl && (
              <p dir="ltr" className="latin" style={{ wordBreak: 'break-all' }}>
                {t('legal.source')} : {LEGAL.sourceUrl}
              </p>
            )}
          </section>
          <section className="legal-card">
            <h2>{t('legal.ossTitle')}</h2>
            <p>{t('legal.oss')}</p>
            <ul dir="ltr" className="latin">
              {OPEN_SOURCE.map(([name, lic]) => (
                <li key={name}>
                  <span>{name}</span>
                  <span className="lic">{lic}</span>
                </li>
              ))}
            </ul>
            <LicenseTexts label={t('legal.fullTexts')} errorLabel={t('legal.fullTextsError')} />
          </section>
          <div className="version">
            Nabra · {__APP_VERSION__} · {t('legal.updated', { date: LEGAL.updated })}
          </div>
        </div>
      )}

      {p.page === 'logs' && (
        <>
          <div
            dir="ltr"
            style={{
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
              background: '#11131a',
              borderRadius: 16,
              padding: 12,
              font: '500 12px/1.45 ui-monospace, Menlo, monospace',
            }}
          >
            {logs.length ? logs.map((e, i) => <LogLine key={i} e={e} />) : <span style={{ color: '#aaa' }}>{t('settings.noLogs')}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
            <button type="button" className="big-btn" style={{ minHeight: 64, fontSize: '1.125rem' }} onClick={p.onShareLogs}>
              {t('settings.shareLogs')}
            </button>
            <button type="button" className="big-btn outline" style={{ minHeight: 64, fontSize: '1.125rem' }} onClick={clearLogs}>
              {t('settings.clearLogs')}
            </button>
          </div>
        </>
      )}

      {(p.page === 'backupDone' || p.page === 'backupError') && (
        <>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
            {p.page === 'backupDone' ? (
              <>
                <Parrot pose="ok" size={200} bg="var(--mint)" />
                <Bubble style={{ padding: '12px 20px' }}>{t('settings.saved')}</Bubble>
              </>
            ) : (
              <>
                <Parrot pose="oups" size={200} bg="var(--peach)" />
                <div className="error-text" role="alert">
                  {t('settings.exportError')}
                </div>
              </>
            )}
          </div>
          {p.page === 'backupError' && (
            <button type="button" className="big-btn" onClick={p.onExport} disabled={p.exporting}>
              {t('settings.retry')}
            </button>
          )}
          <button type="button" className="big-btn outline" style={{ minHeight: 72, fontSize: '1.25rem' }} onClick={() => p.onNavigate('settings')}>
            {t('settings.backToSettings')}
          </button>
        </>
      )}
    </main>
  );
}

function Switch({ on, labelledBy, onClick }: { on: boolean; labelledBy: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={labelledBy}
      className="toggle"
      onClick={onClick}
      style={{ background: on ? 'var(--primary)' : 'var(--hairline-strong)', justifyContent: on ? 'flex-end' : 'flex-start' }}
    >
      <span />
    </button>
  );
}

/** Textes complets des licences (public/licenses.txt, généré par scripts/gen-licenses.mjs), chargés à l'ouverture. */
function LicenseTexts({ label, errorLabel }: { label: string; errorLabel: string }) {
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const onToggle = (e: SyntheticEvent<HTMLDetailsElement>) => {
    if (!e.currentTarget.open || text !== null) return;
    fetch('/licenses.txt')
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then(setText)
      .catch(() => setFailed(true));
  };
  return (
    <details className="license-texts" onToggle={onToggle}>
      <summary>{label}</summary>
      {failed ? <p>{errorLabel}</p> : <pre dir="ltr">{text ?? '…'}</pre>}
    </details>
  );
}
