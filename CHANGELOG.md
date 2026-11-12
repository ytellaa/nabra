# Journal des versions

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · Versions : [SemVer](https://semver.org/lang/fr/).

## [Non publié]

## [0.1.0] — 2026-11-08
Première version de test.

### Ajouté
- Lecture karaoké d'un texte photographié : scanner natif (ML Kit / VisionKit) ou caméra web, OCR, voix du téléphone.
- Historique des lectures, compteur de mots lus, trois vitesses de lecture.
- Interface français / arabe (RTL).
- Réglages : langue, sons, sauvegarde (export JSON), mentions légales, mode debug avec journal.
- Icône et écran de démarrage Nabra.

### Corrigé
- Android : le scan ML Kit n'était pas transmis à l'OCR (chemin de fichier sans `file://`).
