---
name: flow-release
description: Publie une nouvelle version de Nabra — fusionne la feature testée dans main, monte la version SemVer, met à jour le CHANGELOG, génère l'APK et l'AAB signés dans releases/<version>/, crée le commit et le tag vX.Y.Z, pousse sur GitHub et crée la GitHub Release. À utiliser pour « nouvelle version », « release », « publier 0.2.0 », « /flow-release minor ».
argument-hint: [patch|minor|major|X.Y.Z]
---

# flow-release — générer une nouvelle version

Process Nabra : `main` = dernière release, taggée `vX.Y.Z` (= `version` de `app/package.json`). Les builds vont dans `releases/<version>/` (ignoré par git) et sont joints à la GitHub Release.

Commandes lancées depuis la racine du dépôt. Arrêter et expliquer à la première erreur ; ne jamais forcer (`--force`, `reset --hard`, suppression de tag poussé).

## 1. Vérifications
- `git status --porcelain` doit être vide. Sinon, montrer les fichiers et demander s'il faut les committer d'abord.
- `git config user.email` doit être défini (sinon, s'arrêter et l'expliquer).
- Les fichiers de signature existent : `app/android/keystore.properties` et `app/android/nabra-release.jks`. Sinon, s'arrêter : l'utilisateur les a sauvegardés sur son NAS Synology.
- Branche actuelle : `git branch --show-current`. Lister les branches `feat/*` / `fix/*` non fusionnées : `git branch --no-merged main`.

## 2. Contrôle qualité (sur la branche de la feature)
```bash
npm --prefix app run lint
npm --prefix app run typecheck
npm --prefix app run build
```
Tout doit passer. Demander à l'utilisateur de confirmer qu'il a testé la feature sur téléphone.

## 3. Fusion dans main
Pour chaque branche à livrer (en général la branche actuelle) :
```bash
git switch main
git merge --squash feat/<nom>
git commit -m "feat: <résumé de la feature>"
```
Une feature = un commit sur `main`. Si `main` a déjà les changements (release d'un correctif fait directement sur main), passer cette étape.

## 4. Version et CHANGELOG
- Choisir le niveau : `$ARGUMENTS` s'il est donné ; sinon proposer selon `## [Non publié]` du `CHANGELOG.md` — `patch` (corrections seules), `minor` (nouvelle fonctionnalité), `major` (rupture ; `1.0.0` = première publication sur les stores). Faire valider la nouvelle version.
- Monter la version (lance aussi `scripts/sync-version.mjs` pour iOS ; Android la lit au build) :
  ```bash
  npm --prefix app version <patch|minor|major|X.Y.Z> --no-git-tag-version
  ```
- `CHANGELOG.md` : déplacer le contenu de `## [Non publié]` sous un nouveau titre `## [X.Y.Z] — AAAA-MM-JJ` (date du jour), laisser `## [Non publié]` vide au-dessus. Si la section était vide, demander à l'utilisateur ce qui a changé et rédiger les lignes (ton simple, en français).

## 5. Builds signés
```bash
npm --prefix app run android:dist
ls -lh releases/X.Y.Z/
```
Attendu : `releases/X.Y.Z/Nabra-X.Y.Z.apk` et `Nabra-X.Y.Z.aab`. Proposer d'installer l'APK sur un téléphone pour un dernier test.

## 6. Commit et tag
```bash
git add -A
git status --short   # vérifier : package.json, package-lock.json, CHANGELOG.md, éventuellement ios/
git commit -m "release: vX.Y.Z"
git tag -a vX.Y.Z -m "Nabra X.Y.Z"
```

## 7. Publication — demander confirmation avant
Résumer (version, contenu du CHANGELOG, fichiers produits) et **attendre un oui explicite** avant de pousser.
```bash
git remote -v                       # si aucun remote : s'arrêter et proposer de le configurer
git push origin main --follow-tags
gh release create vX.Y.Z releases/X.Y.Z/Nabra-X.Y.Z.apk releases/X.Y.Z/Nabra-X.Y.Z.aab \
  --title "Nabra X.Y.Z" --notes "<section X.Y.Z du CHANGELOG>"
```
Si `gh` n'est pas connecté (`gh auth status`), demander à l'utilisateur de lancer `gh auth login` lui-même.

## 8. Nettoyage
- Supprimer la branche fusionnée : `git branch -D feat/<nom>` (squash ⇒ `-D` nécessaire ; vérifier d'abord que le commit de l'étape 3 est bien sur main).
- Rappeler que l'AAB se dépose à la main dans la Play Console, et donner le lien de la GitHub Release.
