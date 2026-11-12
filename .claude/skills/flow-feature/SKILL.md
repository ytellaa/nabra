---
name: flow-feature
description: Démarre une nouvelle feature Nabra sur une branche isolée feat/<nom> créée depuis main. À utiliser quand l'utilisateur veut commencer, isoler ou reprendre le développement d'une fonctionnalité ou d'un correctif (« nouvelle feature », « je commence X », « /flow-feature mode-dictee »).
argument-hint: <nom-de-la-feature>
---

# flow-feature — isoler une nouvelle feature

Process Nabra (développeur solo) :
- `main` = branche stable, identique à la dernière release, taggée `vX.Y.Z`, poussée sur GitHub.
- `feat/<nom>` = branche locale de travail, une par feature ou correctif. Elle est fusionnée dans `main` par `/flow-release`.

## Étapes

1. **Nom** : prendre `$ARGUMENTS` et le convertir en kebab-case court sans accents (`Mode dictée` → `mode-dictee`). Sans argument, demander le nom. Pour un correctif, utiliser le préfixe `fix/` au lieu de `feat/` si l'utilisateur parle de bug.
2. **État du dépôt** : `git status --porcelain` et `git branch --show-current`.
   - Modifications non commitées : les montrer et demander s'il faut les committer sur la branche actuelle, les emporter dans la nouvelle branche, ou les mettre de côté (`git stash`). Ne jamais les jeter.
   - Si la branche `feat/<nom>` existe déjà : proposer de simplement y revenir (`git switch feat/<nom>`).
3. **Créer la branche depuis main** :
   ```bash
   git switch main
   git switch -c feat/<nom>
   ```
   (Si des modifications doivent être emportées, `git switch -c feat/<nom>` directement depuis la branche actuelle quand c'est `main`.)
4. **Confirmer** en une ou deux lignes : branche créée, et rappel du cycle :
   - développer et tester (`npm --prefix app run dev`, ou APK de test `npm --prefix app run android:apk` → `releases/debug/`) ;
   - committer souvent sur la branche (messages courts : `feat: …`, `fix: …`) ;
   - noter le changement sous `## [Non publié]` dans `CHANGELOG.md` (sections `### Ajouté` / `### Modifié` / `### Corrigé`) ;
   - quand c'est testé : `/flow-release`.

## Règles
- Ne jamais pousser une branche `feat/*` sur GitHub sauf si l'utilisateur le demande (sauvegarde).
- Ne jamais modifier la version dans `app/package.json` ici : c'est le rôle de `/flow-release`.
