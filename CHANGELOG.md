# Journal des versions

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · Versions : [SemVer](https://semver.org/lang/fr/).

## [Non publié]

## [0.4.0] — 2026-11-17

### Ajouté
- Historique : supprimer une lecture avec la corbeille de sa ligne, puis « Supprimer ? » pour confirmer. La photo de la lecture est effacée ; les mots de Mes mots et le compteur de mots lus sont conservés.

## [0.3.1] — 2026-11-17

### Ajouté
- Tests de compatibilité automatiques : à chaque release et pull request, l'APK est testé avec Maestro sur des émulateurs Android 7, 9, 12, 14 et 16. Voir [COMPATIBILITY.md](COMPATIBILITY.md).

### Modifié
- Compatibilité : Nabra exige une WebView récente (Chrome 80 minimum). Sur un téléphone dont la WebView est trop ancienne, l'app affiche « Mise à jour nécessaire » avec un lien vers le Play Store, au lieu d'un écran blanc.

## [0.3.0] — 2026-11-16

### Ajouté
- Mes mots : définition (en français) et traduction (en arabe) de chaque mot, récupérées sur le Wiktionnaire après accord, puis consultables hors connexion. Les cartes de Mes mots arrivent pliées (le mot seul) et se déplient avec une flèche. En cas de problème (pas de connexion, dictionnaire occupé, mot introuvable), un message clair et un bouton Réessayer, sans gêner le reste de l'application.

### Modifié
- Mentions légales : seule exception à « rien n'est envoyé sur Internet », le mot cherché dans le Wiktionnaire ; licence CC BY-SA des définitions.

## [0.2.0] — 2026-11-14

### Ajouté
- « Mes mots » (dans les Réglages) : garder un mot depuis sa fiche, l'écouter, rouvrir les lectures où il apparaît, le retirer. Les mots sont inclus dans la sauvegarde.
- Fiche du mot (appui long sur un mot du Lecteur) : écouter le mot, le corriger, le séparer en deux ou le supprimer ; la correction est enregistrée.

### Modifié
- Les mots douteux restent signalés quand on rouvre une lecture.
- Lecture : la phrase en cours est surlignée, et les abréviations (« M. », « Mme »…) ne coupent plus la phrase.
- Vitesse de lecture : barre à crans de 0,5x à 1x (tortue / lièvre), vitesse enregistrée.
- Mentions légales : lien vers le code source sur GitHub, contact (dépôt GitHub) et auteur des illustrations renseignés.

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
