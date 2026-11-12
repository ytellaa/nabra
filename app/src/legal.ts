/**
 * Informations de l'éditeur affichées dans « Mentions légales ».
 * À COMPLÉTER avant toute publication sur les stores (un contact y est obligatoire).
 * Un champ vide obligatoire s'affiche « À compléter » ; un champ facultatif vide est masqué.
 */
export const LEGAL = {
  /** Nom de la personne ou de l'organisation qui publie l'application (et directeur de la publication). */
  publisher: 'ytellaa',
  /** Adresse postale de l'éditeur (obligatoire pour un professionnel ; une personne non professionnelle
   *  peut ne publier que le nom de l'hébergeur — laisser vide dans ce cas). */
  address: '',
  /** Adresse e-mail ou URL de contact. */
  contact: '',
  /** Auteur / ayant droit des illustrations (mascotte, logo). */
  illustrations: '',
  /** Hébergeur de la version web (PWA) : nom, adresse, téléphone. Vide si pas de version web publiée. */
  host: '',
  /** Dépôt du code source (ex. https://github.com/…/nabra). */
  sourceUrl: '',
  /** Date de dernière mise à jour de ces mentions (AAAA-MM-JJ). */
  updated: '2026-11-11',
};

/** Logiciels libres embarqués dans l'application, avec leur licence (textes complets : public/licenses.txt). */
export const OPEN_SOURCE: Array<[string, string]> = [
  ['Capacitor', 'MIT'],
  ['Capacitor Text-to-Speech', 'MIT'],
  ['Capacitor ML Kit Text Recognition', 'Apache-2.0'],
  ['Capacitor Document Scanner', 'MPL-2.0'],
  ['React', 'MIT'],
  ['Dexie.js', 'Apache-2.0'],
  ['Tesseract.js', 'Apache-2.0'],
  ['Tesseract (modèle français)', 'MIT'],
  ['Lucide', 'ISC'],
  ['Inter', 'SIL OFL 1.1'],
  ['IBM Plex Sans Arabic', 'SIL OFL 1.1'],
  ['Google ML Kit', 'Conditions Google'],
];
