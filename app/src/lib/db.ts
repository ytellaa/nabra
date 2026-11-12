import Dexie, { type EntityTable } from 'dexie';
import type { Lang } from '../i18n';

export interface Session {
  id: string;
  createdAt: number;
  text: string;
  wordCount: number;
  /** Indice de teinte pastel de la vignette. */
  tint: number;
  /** Futur : image générée par IA. */
  imageUri?: string;
  /** Natif : URI du fichier photo ; web : identifiant dans la table `photos`. */
  sourcePhotoUri?: string;
}

interface Kv {
  key: string;
  value: unknown;
}

interface Photo {
  id: string;
  blob: Blob;
}

export const db = new Dexie('nabra') as Dexie & {
  sessions: EntityTable<Session, 'id'>;
  kv: EntityTable<Kv, 'key'>;
  photos: EntityTable<Photo, 'id'>;
};

db.version(1).stores({
  sessions: 'id, createdAt',
  kv: 'key',
  photos: 'id',
});

export type CameraPermission = 'granted' | 'denied' | 'unknown';

export interface Prefs {
  lang: Lang;
  soundOn: boolean;
  totalWordsRead: number;
  cameraPermission: CameraPermission;
  debugOn: boolean;
}

export async function loadPrefs(defaults: Prefs): Promise<Prefs> {
  const rows = await db.kv.toArray();
  const out = { ...defaults } as Record<string, unknown>;
  for (const r of rows) if (r.key in out) out[r.key] = r.value;
  return out as unknown as Prefs;
}

export function savePref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
  return db.kv.put({ key, value });
}

export async function loadSessions(): Promise<Session[]> {
  return db.sessions.orderBy('createdAt').reverse().toArray();
}

export function newId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
