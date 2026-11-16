import Dexie, { type EntityTable } from 'dexie';
import type { Lang } from '../i18n';
import type { WordInfo } from './dictionary';

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
  /** Indices des mots douteux (OCR), pour les signaler à la réouverture. */
  doubtful?: number[];
}

/** Mot gardé dans « Mes mots ». */
export interface MyWord {
  /** Mot normalisé (minuscules, sans ponctuation ni élision) : clé de dédoublonnage. */
  key: string;
  /** Forme affichée (telle que vue la première fois, sans ponctuation). */
  text: string;
  addedAt: number;
  /** Lectures où le mot a été ajouté. */
  sessionIds: string[];
  /** Définition et traduction (Wiktionnaire), ou statut de la dernière recherche. */
  info?: WordInfo;
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
  words: EntityTable<MyWord, 'key'>;
};

/*
 * Migrations : l'historique des utilisateurs doit survivre à chaque mise à jour.
 * - Ne jamais supprimer ni modifier une version déjà publiée : en ajouter une nouvelle (version(N + 1)).
 * - Une table absente d'une nouvelle version est conservée ; pour transformer des données, utiliser `.upgrade()`.
 * - Ne pas changer l'origine de la WebView (`server.hostname` / `androidScheme` dans capacitor.config.ts) :
 *   IndexedDB serait vidé.
 * - Avant chaque release : installer la nouvelle APK par-dessus la précédente et vérifier l'historique (/flow-release).
 */
db.version(1).stores({
  sessions: 'id, createdAt',
  kv: 'key',
  photos: 'id',
});
db.version(2).stores({
  words: 'key, addedAt',
});

export type CameraPermission = 'granted' | 'denied' | 'unknown';

export interface Prefs {
  lang: Lang;
  soundOn: boolean;
  totalWordsRead: number;
  cameraPermission: CameraPermission;
  debugOn: boolean;
  /** Vitesse de lecture (0,5 à 1, pas de 0,1). */
  speed: number;
  /** Accord pour chercher les mots sur le Wiktionnaire (seul accès Internet). */
  dictionaryConsent: 'unknown' | 'yes' | 'no';
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

export async function loadMyWords(): Promise<MyWord[]> {
  return db.words.orderBy('addedAt').reverse().toArray();
}

export function newId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
