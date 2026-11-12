# Nabra

**Nabra lit à voix haute un texte imprimé, mot par mot.** On photographie une page, l'application reconnaît le texte et le lit en surlignant chaque mot, façon karaoké. Un perroquet guide et encourage.

Nabra s'adresse aux apprenants de tout âge, et en particulier aux personnes peu à l'aise avec la technologie : deux appuis pour lire un texte, de grands boutons, aucun compte, et rien n'est envoyé sur Internet. L'interface est en français et en arabe ; le texte lu est en français.

## Fonctionnalités
- Scan de page automatique (Google ML Kit sur Android, VisionKit sur iOS, caméra web en PWA).
- Reconnaissance de texte sur l'appareil, mots douteux signalés.
- Lecture avec la voix du téléphone, mot en cours surligné, trois vitesses.
- Historique des lectures, compteur de mots lus, export de sauvegarde.

## Structure
| Dossier | Contenu |
|---|---|
| [`app/`](app/) | Application React + Vite + TypeScript, empaquetée avec Capacitor 8 (Android, iOS) et publiée en PWA |
| [`design/`](design/) | Maquettes de référence, design tokens, images et sons (source des ressources copiées dans l'app) |

## Démarrer
```bash
cd app
npm install
npm run dev
```

APK Android de test (Java 21 + SDK Android requis) :
```bash
cd app
npm run android:apk
```

Détails : [app/README.md](app/README.md).

## Versions
Versionnage [SemVer](https://semver.org/lang/fr/) — voir [CHANGELOG.md](CHANGELOG.md). La version est définie dans `app/package.json` et reportée automatiquement sur Android, iOS et dans l'application.

## Licence
Code sous licence [MIT](LICENSE).
