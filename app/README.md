# Nabra — application

Implémentation du handoff `../design/README.md`.

| Brique | Natif (Capacitor 8 : Android, iOS) | PWA |
|---|---|---|
| Capture | `@capgo/capacitor-document-scanner` (ML Kit / VisionKit) + contrôle de netteté | Caméra web : détection de page, netteté, stabilité 0,8 s, capture auto |
| OCR | `@capacitor-mlkit/text-recognition` (ML Kit v2) | Tesseract.js, servi en local (`public/tesseract`) |
| Voix | `@capacitor-community/text-to-speech` (`onRangeStart`) | Web Speech API (`boundary`) |
| Stockage | Dexie.js + `@capacitor/filesystem` pour les photos | Dexie.js (photos en blobs) |

Le code natif / web est choisi à l'exécution (`src/lib/platform.ts`).

## Lancer

```bash
npm install
npm run dev
```

`npm run dev` et `npm run build` copient d'abord les images, sons et fichiers Tesseract dans `public/` (`scripts/copy-assets.mjs`).

## Android / iOS

Les projets natifs sont dans `android/` et `ios/`. Après chaque modification du code web :

```bash
npm run cap:sync
```

Puis ouvrir dans Android Studio (`npx cap open android`) ou Xcode (`npx cap open ios`).

**Prérequis :** Android Studio (JDK 21 + SDK 36) ; Xcode complet et CocoaPods pour iOS (le plugin OCR ML Kit ne supporte pas Swift Package Manager).

**Configuration native déjà faite :**
- Android : orientation portrait, visibilité des moteurs de synthèse vocale (Android 11+), partage depuis le cache (export).
- iOS : cible minimale 15.5 (exigée par ML Kit), message d'autorisation caméra en français, langues fr/ar, orientation portrait sur iPhone, `PrivacyInfo.xcprivacy`.

**À savoir :**
- Le scanner de documents ML Kit ne fonctionne pas sur l'émulateur Android : tester sur un vrai téléphone.
- Les sons sont en `.ogg`, que certaines versions d'iOS ne lisent pas : prévoir une version `.m4a`.

## Versions

SemVer (`MAJEUR.MINEUR.CORRECTIF`), source unique : `version` dans `package.json`.

- Android : `versionName` = version, `versionCode` = MAJEUR×10000 + MINEUR×100 + CORRECTIF (calculés par `android/app/build.gradle`).
- iOS : `MARKETING_VERSION` et `CURRENT_PROJECT_VERSION` reportés par `scripts/sync-version.mjs` (lancé à chaque build).
- Application : affichée dans Réglages et Mentions légales.

Publier une version :

```bash
npm version patch   # correctif : 0.1.0 → 0.1.1 (minor : nouvelle fonction, major : rupture)
```

Puis compléter `CHANGELOG.md`, committer et créer le tag `vX.Y.Z`. Les versions `0.x` sont des versions de test ; `1.0.0` = première publication sur les stores.

## Version release (signée)

```bash
npm run android:release   # APK signé → ../releases/<version>/Nabra-<version>.apk (à partager)
npm run android:aab       # bundle signé → ../releases/<version>/Nabra-<version>.aab (pour le Play Console)
npm run android:dist      # les deux d'un coup
```

La signature utilise `android/nabra-release.jks` et `android/keystore.properties` (mot de passe). Ces deux fichiers restent **uniquement en local** (exclus de git) : **sauvegardez-les** dans un endroit sûr (gestionnaire de mots de passe, coffre chiffré). Sans eux, impossible de publier une mise à jour qui s'installe par-dessus la version existante.

## Icônes et écran de démarrage

Sources dans `resources/` (`icon.svg`, `icon-foreground.svg`, `logo.svg`). Pour tout régénérer :

```bash
npm run icons
```

## Mentions légales

Les informations de l'éditeur (nom, contact, auteur des illustrations, URL du dépôt) sont dans `src/legal.ts` : **à compléter avant publication**.

## Structure

- `src/screens/` : Accueil, Caméra, Lecteur, Fin, Réglages (langue, sauvegarde).
- `src/lib/` : OCR, scanner, synthèse vocale, moteur karaoké (`useReadAloud`), sons, base Dexie, export.
- `src/i18n/` : textes FR / AR (repris du handoff, avec quelques clés ajoutées).
