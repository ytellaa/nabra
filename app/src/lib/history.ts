import { db, type MyWord, type Session } from './db';
import { log, logError } from './debug';
import { isNative } from './platform';

/**
 * Mots de Mes mots qui citaient la lecture supprimée, sans cette lecture.
 * Les mots sont gardés : seul le lien « Vu dans » disparaît.
 */
export function unlinkSession(words: MyWord[], sessionId: string): MyWord[] {
  return words
    .filter((w) => w.sessionIds.includes(sessionId))
    .map((w) => ({ ...w, sessionIds: w.sessionIds.filter((id) => id !== sessionId) }));
}

/**
 * Supprime une lecture de l'historique : la lecture, son lien dans Mes mots (une seule transaction),
 * puis sa photo. Le compteur « mots lus » n'est pas touché.
 * Renvoie les mots modifiés, ou `null` si la suppression a échoué (rien n'a changé).
 */
export async function deleteSession(session: Session): Promise<MyWord[] | null> {
  let changed: MyWord[] = [];
  try {
    await db.transaction('rw', db.sessions, db.words, db.photos, async () => {
      // Pas d'index sur `sessionIds` : Mes mots reste petit, on parcourt la table.
      changed = unlinkSession(await db.words.toArray(), session.id);
      if (changed.length) await db.words.bulkPut(changed);
      await db.photos.delete(session.id); // PWA : photo dans IndexedDB (sans effet si absente)
      await db.sessions.delete(session.id);
    });
  } catch (e) {
    logError('history', 'Échec de la suppression de la lecture', e);
    return null;
  }
  log('history', `Lecture supprimée : ${session.id}`, { words: changed.length });
  if (isNative && session.sourcePhotoUri) void deleteNativePhoto(session.id);
  return changed;
}

/** Natif : fichier `photos/<id>.jpg` du dossier de données. Un fichier déjà absent n'est pas une erreur. */
async function deleteNativePhoto(id: string) {
  try {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    await Filesystem.deleteFile({ path: `photos/${id}.jpg`, directory: Directory.Data });
  } catch (e) {
    log('history', 'Photo déjà absente ou non supprimée', String((e as Error)?.message ?? e));
  }
}
