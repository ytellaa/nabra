# Compatibilité Android

Ce fichier dit sur quelles versions d'Android Nabra fonctionne, comment c'est vérifié, et ce qui peut restreindre la compatibilité. Il est mis à jour à chaque release.

## Niveau déclaré

| Élément | Valeur | Où c'est défini |
|---|---|---|
| Android minimum (`minSdk`) | **7.0 — API 24** | [`app/android/variables.gradle`](app/android/variables.gradle) |
| Android ciblé (`targetSdk`) | **16 — API 36** | idem |
| SDK de compilation (`compileSdk`) | API 36 | idem |
| Orientation | Portrait uniquement | [`AndroidManifest.xml`](app/android/app/src/main/AndroidManifest.xml) |
| Architectures (ABI) | Toutes (pas de filtre) | [`app/android/app/build.gradle`](app/android/app/build.gradle) |
| Autorisations | Internet | `AndroidManifest.xml` |

Tous les plugins (Capacitor 8, ML Kit, synthèse vocale, scanner de documents) acceptent l'API 24. Si une dépendance exigeait une version plus récente, le build Android échouerait : l'API 24 est donc bien le minimum réel du code natif.

## Ce qui peut restreindre la compatibilité sans changer le `minSdk`

| Dépendance | Effet | Appareils concernés |
|---|---|---|
| **WebView système** | Toute l'interface (React) tourne dans la WebView. Une WebView trop ancienne affiche un écran blanc ou une erreur JavaScript. | Android 7 à 9 dont la WebView n'a jamais été mise à jour par le Play Store. |
| **Google Play Services** | Le scanner de page (ML Kit Document Scanner) en a besoin. | Téléphones sans services Google (Huawei récents, certaines ROM). |
| **Moteur de synthèse vocale** | La voix vient du téléphone. La qualité et les langues disponibles varient. | Tous : à vérifier, surtout pour l'arabe. |
| **Mémoire** | La reconnaissance de texte (ML Kit, Tesseract en WebAssembly) consomme beaucoup. | Téléphones d'entrée de gamme (≤ 2 Go de RAM). |

## Tests automatiques

Le job `compat` de [`.github/workflows/ci.yml`](.github/workflows/ci.yml) installe l'APK de test sur des émulateurs Android, puis [Maestro](https://docs.maestro.dev) joue les scénarios de [`app/.maestro/`](app/.maestro/).

**Quand :** à chaque tag de release (`vX.Y.Z`), à chaque pull request (dont celles de Dependabot) et à la demande (onglet Actions → CI → *Run workflow*).

**Versions testées :** API 24 (7.0), 28 (9), 31 (12), 34 (14), 36 (16).

**Scénarios :**

| Fichier | Vérifie |
|---|---|
| `01-demarrage.yaml` | L'app démarre et l'écran d'accueil s'affiche. |
| `02-reglages.yaml` | Navigation dans les Réglages, mentions légales, bouton Retour de l'app et bouton retour Android. |
| `03-langue-arabe.yaml` | Bascule français → arabe (droite à gauche) → français. |

**Résultats :** le résumé du run GitHub affiche, pour chaque version, le nombre de scénarios réussis et la version de la WebView de l'émulateur. Les captures d'écran et le rapport sont dans les artefacts `compat-api-XX`.

**Limites des émulateurs :**
- La WebView est celle d'origine de l'image système, jamais mise à jour : c'est le pire cas. Un échec sur API 24 ou 28 signifie « ne marche pas si la WebView n'a jamais été mise à jour », pas « ne marche sur aucun Android 7 ».
- Pas de caméra : le scan et la reconnaissance de texte ne sont pas testés.
- Pas de surcouche constructeur (Samsung, Xiaomi…) : à tester sur de vrais appareils (Firebase Test Lab ou téléphone physique).

### Lancer les scénarios en local

Avec un émulateur ou un téléphone branché et l'APK de test installé (`npm --prefix app run android:apk`) :

```bash
maestro test app/.maestro
```

## Résultats par release

Légende : ✅ tous les scénarios passent · ⚠️ échec partiel · ❌ l'app ne démarre pas · — non testé

| Release | API 24 (7.0) | API 28 (9) | API 31 (12) | API 34 (14) | API 36 (16) | Vrais appareils | Remarques |
|---|---|---|---|---|---|---|---|
| 0.2.0 | — | — | — | — | — | — | Avant la mise en place des tests |

## Règle pour chaque évolution

Une évolution restreint la compatibilité si elle :
- relève le `minSdk` ;
- ajoute une dépendance à Google Play Services ou à un matériel (`uses-feature`) ;
- utilise une fonction JavaScript ou CSS récente non prise en charge par les anciennes WebView ;
- ajoute une autorisation.

Dans ce cas : le noter dans le `CHANGELOG.md` (section `### Modifié`, mention « Compatibilité ») et mettre à jour ce fichier. Avant la publication sur Google Play, vérifier le nombre d'appareils compatibles dans le catalogue d'appareils de la Play Console.
