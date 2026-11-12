import { db, type Session } from './db';
import { log, logError } from './debug';
import { isNative } from './platform';

const toBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });

/**
 * Enregistre la photo source d'une session.
 * Natif : fichier dans le dossier de données de l'appli. PWA : blob dans IndexedDB (Dexie).
 */
export async function savePhoto(id: string, photo: Blob | string): Promise<string | undefined> {
  try {
    if (isNative) {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      let data: string;
      if (typeof photo === 'string') {
        // Chemin de fichier renvoyé par le scanner natif
        data = (await Filesystem.readFile({ path: photo })).data as string;
      } else {
        data = await toBase64(photo);
      }
      const res = await Filesystem.writeFile({
        path: `photos/${id}.jpg`,
        data,
        directory: Directory.Data,
        recursive: true,
      });
      log('photo', 'Photo enregistrée', res.uri);
      return res.uri;
    }
    if (typeof photo === 'string') return undefined;
    await db.photos.put({ id, blob: photo });
    return `idb:${id}`;
  } catch (e) {
    logError('photo', 'Échec de l’enregistrement de la photo', e);
    return undefined;
  }
}

export type ExportResult = 'ok' | 'cancel' | 'error';

/** Exporte un fichier JSON contenant `sessions` et `totalWordsRead`, via la feuille de partage. */
export async function exportBackup(sessions: Session[], totalWordsRead: number): Promise<ExportResult> {
  const payload = {
    app: 'Nabra',
    version: 1,
    exportedAt: new Date().toISOString(),
    totalWordsRead,
    sessions,
  };
  const json = JSON.stringify(payload, null, 2);
  const name = `nabra-${new Date().toISOString().slice(0, 10)}.json`;

  try {
    if (isNative) {
      const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
      const { Share } = await import('@capacitor/share');
      const file = await Filesystem.writeFile({ path: name, data: json, directory: Directory.Cache, encoding: Encoding.UTF8 });
      await Share.share({ title: 'Nabra', files: [file.uri] });
      return 'ok';
    }
    const file = new File([json], name, { type: 'application/json' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Nabra' });
      return 'ok';
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return 'ok';
  } catch (e) {
    logError('export', 'Échec de l’export', e);
    const msg = String((e as Error)?.message ?? e);
    if ((e as Error)?.name === 'AbortError' || /cancel/i.test(msg)) return 'cancel';
    return 'error';
  }
}
