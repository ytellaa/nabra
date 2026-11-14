import { useState } from 'react';
import { Trash2, Volume2 } from 'lucide-react';
import { useApp } from '../context';
import { formatDay } from '../i18n';
import type { MyWord, Session } from '../lib/db';
import { titleOf } from '../lib/words';
import { Parrot } from './ui';

interface Props {
  words: MyWord[];
  sessions: Session[];
  onListen: (w: MyWord) => void;
  onOpenSession: (s: Session) => void;
  onRemove: (w: MyWord) => void;
}

/** Page « Mes mots » : écouter un mot, rouvrir les lectures où il a été vu, le retirer. */
export function MyWordsList({ words, sessions, onListen, onOpenSession, onRemove }: Props) {
  const { t, lang } = useApp();
  const [confirm, setConfirm] = useState<string | null>(null);
  const byId = new Map(sessions.map((s) => [s.id, s]));

  if (!words.length) {
    return (
      <div className="words-empty">
        <Parrot pose="lit" size={160} bg="var(--yellow)" />
        <p className="note">{t('words.empty')}</p>
      </div>
    );
  }

  return (
    <ul className="my-words">
      {words.map((w) => {
        const seen = w.sessionIds.map((id) => byId.get(id)).filter((s): s is Session => !!s);
        return (
          <li key={w.key} className="my-word">
            <div className="my-word-head">
              <button type="button" className="my-word-listen" onClick={() => onListen(w)} aria-label={`${t('word.listen')} : ${w.text}`}>
                <Volume2 size={24} strokeWidth={2.2} aria-hidden="true" />
                <span dir="ltr" lang="fr">
                  {w.text}
                </span>
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
          </li>
        );
      })}
    </ul>
  );
}
