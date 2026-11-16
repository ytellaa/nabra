import { useState } from 'react';
import { BookOpen, ChevronDown, ExternalLink, RotateCcw, Trash2, Volume2 } from 'lucide-react';
import { useApp } from '../context';
import { formatDay, type TKey } from '../i18n';
import type { MyWord, Session } from '../lib/db';
import { wiktionaryUrl, type WordInfo } from '../lib/dictionary';
import { titleOf } from '../lib/words';
import { Parrot } from './ui';

interface Props {
  words: MyWord[];
  sessions: Session[];
  lookingUp: ReadonlySet<string>;
  consent: 'unknown' | 'yes' | 'no';
  onConsent: (yes: boolean) => void;
  onLookup: (w: MyWord) => void;
  onListen: (w: MyWord) => void;
  onOpenSession: (s: Session) => void;
  onRemove: (w: MyWord) => void;
}

/** Page « Mes mots » : écouter, définition et traduction, lectures où le mot a été vu, retrait. */
export function MyWordsList({ words, sessions, lookingUp, consent, onConsent, onLookup, onListen, onOpenSession, onRemove }: Props) {
  const { t, lang } = useApp();
  const [confirm, setConfirm] = useState<string | null>(null);
  // Cartes dépliées : toutes pliées à chaque arrivée sur la page.
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const toggle = (key: string) =>
    setOpen((cur) => {
      const next = new Set(cur);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const [asking, setAsking] = useState<MyWord | null>(null);
  const byId = new Map(sessions.map((s) => [s.id, s]));

  const lookup = (w: MyWord) => (consent === 'yes' ? onLookup(w) : setAsking(w));

  if (!words.length) {
    return (
      <div className="words-empty">
        <Parrot pose="lit" size={160} bg="var(--yellow)" />
        <p className="note">{t('words.empty')}</p>
      </div>
    );
  }

  return (
    <>
      <ul className="my-words">
        {words.map((w) => {
          const seen = w.sessionIds.map((id) => byId.get(id)).filter((s): s is Session => !!s);
          const isOpen = open.has(w.key);
          const bodyId = `word-body-${w.key}`;
          return (
            <li key={w.key} className={`my-word${isOpen ? ' open' : ''}`}>
              <div className="my-word-head">
                <button type="button" className="my-word-listen" onClick={() => onListen(w)} aria-label={`${t('word.listen')} : ${w.text}`}>
                  <Volume2 size={24} strokeWidth={2.2} aria-hidden="true" />
                  <span dir="ltr" lang="fr">
                    {w.text}
                  </span>
                </button>
                <button
                  type="button"
                  className="my-word-toggle"
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  aria-label={`${isOpen ? t('words.collapse') : t('words.expand')} : ${w.text}`}
                  onClick={() => toggle(w.key)}
                >
                  <ChevronDown size={24} strokeWidth={2.2} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`my-word-remove${confirm === w.key ? ' confirm' : ''}`}
                  aria-label={confirm === w.key ? t('words.removeConfirm') : t('words.remove')}
                  onClick={() => (confirm === w.key ? onRemove(w) : setConfirm(w.key))}
                  onBlur={() => setConfirm((c) => (c === w.key ? null : c))}
                >
                  {confirm === w.key ? t('words.removeConfirm') : <Trash2 size={20} strokeWidth={2.2} aria-hidden="true" />}
                </button>
              </div>

              {isOpen && (
                <div id={bodyId} className="my-word-body">
                  <WordInfoBlock word={w} loading={lookingUp.has(w.key)} onLookup={() => lookup(w)} />

                  {seen.length > 0 && (
                    <div className="my-word-seen">
                      <span>{t('words.seenIn')}</span>
                      {seen.map((s) => (
                        <button key={s.id} type="button" className="seen-chip" onClick={() => onOpenSession(s)}>
                          <span dir="ltr" lang="fr">
                            {titleOf(s.text)}
                          </span>
                          <span className="seen-date">{formatDay(s.createdAt, lang)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {asking && (
        <div className="sheet-backdrop" onClick={() => setAsking(null)}>
          <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="dict-consent-title" onClick={(e) => e.stopPropagation()}>
            <h2 id="dict-consent-title" className="consent-title">
              {t('dict.consentTitle')}
            </h2>
            <p className="note" style={{ margin: 0 }}>
              {t('dict.consentText')}
            </p>
            <button
              type="button"
              className="sheet-btn primary"
              autoFocus
              onClick={() => {
                onConsent(true);
                onLookup(asking);
                setAsking(null);
              }}
            >
              {t('dict.consentYes')}
            </button>
            <button
              type="button"
              className="sheet-btn"
              onClick={() => {
                onConsent(false);
                setAsking(null);
              }}
            >
              {t('dict.consentNo')}
            </button>
          </section>
        </div>
      )}
    </>
  );
}

const STATUS_MESSAGES: Record<Exclude<WordInfo['status'], 'ok'>, TKey> = {
  offline: 'dict.offline',
  busy: 'dict.busy',
  'not-found': 'dict.notFound',
  unreadable: 'dict.unreadable',
};

/** Définition et traduction d'un mot, ou l'état de la recherche. */
function WordInfoBlock({ word, loading, onLookup }: { word: MyWord; loading: boolean; onLookup: () => void }) {
  const { t } = useApp();
  const [expanded, setExpanded] = useState(false);
  const info = word.info;

  if (loading) {
    return (
      <div className="dict dict-state" role="status">
        <span className="dict-spinner" aria-hidden="true" />
        {t('dict.loading')}
      </div>
    );
  }

  if (!info) {
    return (
      <button type="button" className="dict-lookup" onClick={onLookup}>
        <BookOpen size={20} strokeWidth={2.2} aria-hidden="true" />
        {t('dict.lookup')}
      </button>
    );
  }

  const lemmaLine = info.lemma && (
    <p className="dict-lemma">
      {t('dict.formOf')}{' '}
      <bdi dir="ltr" lang="fr">
        « {info.lemma} »
      </bdi>
    </p>
  );
  const source = (
    <a className="dict-source" href={wiktionaryUrl(info.page ?? info.lemma ?? word.text)} target="_blank" rel="noopener noreferrer">
      {info.status === 'ok' ? t('dict.source') : t('dict.open')}
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  );

  if (info.status !== 'ok') {
    return (
      <div className="dict">
        {lemmaLine}
        <p className="dict-state">{t(STATUS_MESSAGES[info.status])}</p>
        <div className="dict-actions">
          <button type="button" className="dict-retry" onClick={onLookup}>
            <RotateCcw size={16} strokeWidth={2.2} aria-hidden="true" />
            {t('dict.retry')}
          </button>
          {info.status === 'unreadable' && source}
        </div>
      </div>
    );
  }

  const entries = expanded ? info.entries : info.entries.slice(0, 1);
  const total = info.entries.reduce((n, e) => n + e.senses.length, 0);
  const canExpand = total > 3 || info.entries.length > 1;

  return (
    <div className="dict">
      {lemmaLine}
      {entries.map((e, i) => (
        <div key={i} className="dict-entry">
          <div dir="ltr" lang="fr">
            <span className="dict-pos">{e.pos}</span>
            <ol>
              {(expanded ? e.senses : e.senses.slice(0, 3)).map((s, j) => (
                <li key={j}>{s}</li>
              ))}
            </ol>
          </div>
          <div className="dict-trad">
            <span className="dict-label">{t('dict.translation')}</span>
            {e.translations.length ? (
              <span className="dict-ar" dir="rtl" lang="ar">
                {e.translations.join('، ')}
              </span>
            ) : (
              <span className="dict-none">{t('dict.noTranslation')}</span>
            )}
          </div>
        </div>
      ))}
      <div className="dict-actions">
        {canExpand && (
          <button type="button" className="dict-more" aria-expanded={expanded} onClick={() => setExpanded((x) => !x)}>
            {expanded ? t('dict.less') : t('dict.more')}
          </button>
        )}
        {source}
      </div>
    </div>
  );
}
