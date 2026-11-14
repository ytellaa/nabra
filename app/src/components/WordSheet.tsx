import { useEffect, useState } from 'react';
import { BookmarkCheck, BookmarkPlus, Pencil, Trash2, Volume2, X } from 'lucide-react';
import { useApp } from '../context';
import { setBackHandler } from '../lib/backHandler';

interface Props {
  word: string;
  /** Faux s'il ne reste qu'un mot : on ne peut pas vider le texte. */
  canDelete: boolean;
  /** Absent : bouton « Mes mots » masqué. */
  inMyWords?: boolean;
  onAdd?: () => void;
  onListen: () => void;
  /** Nouveau texte (peut contenir des espaces pour séparer des mots) ; null = supprimer le mot. */
  onCorrect: (value: string | null) => void;
  onClose: () => void;
}

/** Fiche d'un mot du Lecteur, ouverte par appui long : écouter, corriger, ajouter à Mes mots. */
export function WordSheet({ word, canDelete, inMyWords, onAdd, onListen, onCorrect, onClose }: Props) {
  const { t } = useApp();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(word);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setBackHandler(onClose);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      setBackHandler(null);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const trimmed = value.trim().replace(/\s+/g, ' ');

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="sheet" role="dialog" aria-modal="true" aria-label={word} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div className="sheet-word" dir="ltr" lang="fr">
            {word}
          </div>
          <button type="button" className="icon-btn" aria-label={t('word.close')} onClick={onClose}>
            <X size={24} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        {!editing ? (
          <>
            <button type="button" className="sheet-btn primary" onClick={onListen} autoFocus>
              <Volume2 size={24} strokeWidth={2.2} aria-hidden="true" />
              {t('word.listen')}
            </button>
            <button type="button" className="sheet-btn" onClick={() => setEditing(true)}>
              <Pencil size={22} strokeWidth={2.2} aria-hidden="true" />
              {t('word.correct')}
            </button>
            {onAdd && (
              <button type="button" className={`sheet-btn${inMyWords ? ' done' : ''}`} onClick={onAdd} disabled={inMyWords}>
                {inMyWords ? (
                  <BookmarkCheck size={22} strokeWidth={2.2} aria-hidden="true" />
                ) : (
                  <BookmarkPlus size={22} strokeWidth={2.2} aria-hidden="true" />
                )}
                {inMyWords ? t('word.added') : t('word.add')}
              </button>
            )}
          </>
        ) : (
          <form
            className="sheet-edit"
            onSubmit={(e) => {
              e.preventDefault();
              if (trimmed) onCorrect(trimmed);
            }}
          >
            <label htmlFor="word-edit">{t('word.editLabel')}</label>
            <input
              id="word-edit"
              dir="ltr"
              lang="fr"
              autoFocus
              autoCapitalize="off"
              autoComplete="off"
              spellCheck
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <p className="sheet-hint">{t('word.editHint')}</p>
            <button type="submit" className="sheet-btn primary" disabled={!trimmed}>
              {t('word.save')}
            </button>
            {canDelete && (
              <button
                type="button"
                className="sheet-btn danger"
                onClick={() => (confirmDelete ? onCorrect(null) : setConfirmDelete(true))}
              >
                <Trash2 size={22} strokeWidth={2.2} aria-hidden="true" />
                {confirmDelete ? t('word.deleteConfirm') : t('word.delete')}
              </button>
            )}
            <button type="button" className="sheet-btn" onClick={onClose}>
              {t('word.cancel')}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
