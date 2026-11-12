# Handoff : Vocalire — application mobile d'aide à la lecture (MVP)

> **Nom de l'application : Nabra** (« Vocalire » était le nom de travail). Le logo de l'app est dans `app/resources/logo.svg` ; les autres ressources de ce dossier restent valables.
>
> **Ce dossier fait partie du build** : `app/scripts/copy-assets.mjs` copie `assets/images` et `assets/sounds` dans l'app. Les textes de l'interface font foi dans `app/src/i18n/`.

## Vue d'ensemble
Vocalire aide les apprenants à lire un texte imprimé en français, **quel que soit leur âge** : enfants, adolescents et adultes en apprentissage de la lecture ou du français. L'application s'adresse **en particulier aux personnes peu à l'aise avec la technologie** : chaque écran se comprend sans explication, une seule action principale est mise en avant, les boutons sont grands, les textes courts, et aucune configuration n'est nécessaire avant de commencer.

L'apprenant photographie une page, l'application reconnaît le texte (OCR) et le lit à voix haute en surlignant chaque mot, façon karaoké. Un perroquet mascotte guide et encourage, sans infantiliser. L'interface est bilingue français / arabe (RTL complet en arabe). Le texte lu reste toujours en français, de gauche à droite.

### Utilisateurs cibles
- **Apprenants de tout âge** : enfants qui apprennent à lire, adultes en alphabétisation ou en apprentissage du français (FLE), personnes allophones arabophones.
- **Priorité : les personnes peu à l'aise avec le numérique.** Conséquences pour la conception :
  - parcours en 2 appuis maximum pour lire un texte, capture automatique ;
  - libellés en toutes lettres à côté des icônes dès que possible, pas de geste caché (glissement, appui long) ;
  - cibles tactiles larges, contrastes élevés, prise en charge de la taille de police du système ;
  - aucun compte, aucune connexion, aucune donnée envoyée sur Internet ;
  - ton bienveillant et neutre, adapté aussi bien à un enfant qu'à un adulte.

Plateforme cible : **Android** (maquettes en 412 × 892 dp).

## À propos des fichiers de design
Les fichiers de `prototype/` sont des **références de design en HTML** : des prototypes qui montrent l'apparence et le comportement attendus. Ce n'est **pas** du code de production à copier. La tâche est de **recréer ces écrans dans l'environnement de l'application** (Kotlin/Jetpack Compose, Flutter, React Native…) avec ses propres conventions. Si aucun projet n'existe encore, choisir le framework le plus adapté. Recommandation : **Flutter** ou **Jetpack Compose**, pour l'accès natif à la caméra, à l'OCR (ML Kit) et à la synthèse vocale (TTS) Android.

Pour ouvrir le prototype : servir la racine du dépôt avec un serveur statique (ex. `npx serve .`), puis ouvrir `design/prototype/Parcours 1 - Nouvelle lecture.dc.html`. Le panneau de droite affiche l'étape en cours et les sons déclenchés.

## Fidélité
**Haute fidélité.** Couleurs, typographie, tailles, rayons, textes et interactions sont définitifs. Le cadre Android (barre d'état, barre de navigation) sert seulement de présentation et n'est pas à reproduire.

---

## Écrans

Conventions communes à tous les écrans :
- Fond d'écran `#fafaf9`, sauf la Caméra (`#070f24`) et la Fin (`#fef7d6`).
- Marges latérales de 20 dp, espacement vertical de 16 dp (14 dp sur le Lecteur).
- Cibles tactiles d'au moins 48 dp, boutons principaux de 76 à 80 dp de haut, placés en bas pour le pouce.
- En arabe : `dir=rtl`, les flèches retour et les chevrons sont inversés, la police passe à IBM Plex Sans Arabic. Les extraits de texte français et les nombres restent LTR.

### 1. Accueil
**Rôle :** lancer une nouvelle lecture ou en reprendre une.

**En-tête** (rangée, espace entre les éléments) :
- Logo `logo.svg`, 132 × 44, en `contain`.
- À droite, deux boutons de 48 × 48, rayon 16, fond blanc, bordure 1,5 dp `#c8c4be`, survol `#f6f5f4` :
  - **Bouton langue** : affiche l'autre langue (`عربي` en FR, `Français` en AR) en 16 sp, graisse 600, dans la police de la langue affichée. Un appui bascule la langue.
  - **Bouton Réglages** : icône engrenage de 22 dp (Lucide `settings`), couleur `#37352f`.

**État premier lancement** (historique vide) :
- Au centre, une bulle : fond blanc, bordure 1,5 dp `#e5e3df`, rayon 24, padding 16 × 22, ombre `0 4px 12px rgba(26,26,26,.06)`, texte 22 sp 600, centré, largeur max 300.
  - Texte : « Prends en photo ton premier texte ! »
- Sous la bulle, le perroquet `parrot-salue.svg` dans un cercle de 220 dp, fond `#fef7d6`.
- Rien d'autre que ces éléments et le gros bouton (pas de liste vide, pas de compteur).

**État avec historique** :
- **Rangée perroquet** (gap 14) : perroquet `parrot-salue` dans un cercle de 92 dp (fond `#fef7d6`), puis la bulle « Prêt à lire ? » (rayon 20, padding 12 × 18, texte 22 sp 600).
- **Carte compteur** : fond `#d9f3e1`, rayon 20, padding 14 × 18.
  - Label « Mots lus » à gauche (16 sp, 500, `#37352f`).
  - Total à droite (32 sp, 600, interlettrage −0,5).
- **Libellé** « MES LECTURES » : 13 sp, 600, majuscules, interlettrage 0,6, `#5d5b54`.
- **Liste** défilante, gap 10, la plus récente en premier. Chaque ligne est un bouton :
  - Fond blanc, bordure 1,5 dp `#e5e3df`, rayon 20, padding 10, gap 14.
  - **Vignette** 64 × 72, rayon 14 : `vignette-defaut.svg` en `cover`, posée sur une teinte pastel qui tourne d'une session à l'autre (pêche, lavande, ciel, menthe, rose).
  - **Titre** : les 4 premiers mots du texte suivis de « … », 17 sp, 600, sur une ligne avec ellipse, toujours LTR.
  - **Méta** : « {date} · {n} mots », 14 sp, `#787671`.
  - Un appui ouvre le Lecteur en mode reprise.

**Gros bouton « Nouvelle lecture »** (toujours en bas) :
- Hauteur 80, rayon 22, fond `#6246d9`, survol `#4f36bd`, appui `#3e2a9e`.
- Icône caméra de 30 dp, gap 14, texte blanc 22 sp 600.

### 1b. Autorisation caméra
Boîte de dialogue système Android, affichée **une seule fois**, au premier appui sur « Nouvelle lecture ». La maquette en montre une approximation ; en production, utiliser la vraie demande de permission du système.
- Refus : retour à l'Accueil.
- Acceptation : ouverture de la Caméra.

### 2. Caméra
**Rôle :** cadrer la page. La capture est automatique.
- Fond `#070f24`, barre d'état en mode sombre.
- **En-tête** :
  - Bouton retour 52 × 52, rayon 16, bordure 1,5 dp blanc à 40 %, icône flèche blanche. Il ramène à l'Accueil.
  - Au centre, une pastille de statut : rayon 9999, fond `#1a2a52`, texte blanc 15 sp 600, précédé d'un point de 10 dp dont la couleur suit l'état.
- **Viseur** : remplit l'espace restant, rayon 24, fond `#1a2a52`.
  - Cadre guide de 264 × 336, bordure 3 dp, rayon 20, couleur selon l'état.
  - Au moment de la capture : flash blanc à 90 % d'opacité, transition de 200 ms.
- **Rangée perroquet** :
  - Cercle de 76 dp : `parrot-oups` quand l'image est floue (fond `#ffe8d4`), sinon `parrot-photo` (fond `#fef7d6`).
  - Bulle blanche, rayon 20, texte 18 sp 600.
- **Déclencheur manuel de secours** : cercle de 68 dp, anneau blanc de 4 dp, disque intérieur de 50 dp blanc à 85 %. Libellé « Prendre la photo » dessous, 13 sp, `#a4a097`.

| État | Couleur (point et cadre) | Pastille | Bulle du perroquet |
|---|---|---|---|
| Recherche | blanc | Cherche la page… | Montre-moi ta page. |
| Flou | `#dd5b00` | Image floue | Oups, tremblote un peu ! |
| Net | `#1aae39` | Page nette | Parfait, ne bouge plus… |

**Logique :**
- La capture se déclenche quand la page est détectée **et** nette, stable environ 0,8 s.
- Elle déclenche `son-declic`, lance l'OCR, puis ouvre le Lecteur.

### 3. Lecteur
**Rôle :** lire le texte en karaoké.

**En-tête :**
- Bouton retour 52 × 52, fond blanc, bordure `#c8c4be`. Il ramène à l'Accueil.
- À droite, une pastille de progression : « {n} mots » avant la lecture, « {i} / {n} » pendant. Fond blanc, bordure `#e5e3df`, 16 sp 600 `#5d5b54`, toujours LTR.

**Bandeau mots douteux** (seulement après une capture qui contient des mots douteux ; jamais lors d'une reprise) :
- Fond `#fef7d6`, rayon 22, padding 14.
- Perroquet `parrot-doute` (cercle de 56 dp, fond blanc) et texte « {n} mots à vérifier » (18 sp 600).
- Deux boutons sur une grille 1fr 1fr, hauteur 52, rayon 16 :
  - **Rescanner** : fond blanc, bordure 1,5 dp `#1a1a1a`. Rouvre la Caméra.
  - **Lire quand même** : fond `#1a1a1a`, texte blanc. Lance la lecture en mode dégradé.
- Appuyer sur ▶ équivaut à « Lire quand même ». Le bandeau disparaît dès que la lecture démarre.

**Zone de texte :**
- Fond `#f8f5e8`, rayon 24, padding 20 × 18, défilante.
- Inter 24 sp, 400, interligne 1,75, toujours LTR. Les mots sont en flex-wrap avec un écart de colonne de 2 dp.
- Chaque mot : padding 0 × 4, rayon 8, cliquable.
  - **Mot en cours** : fond `#6246d9`, texte blanc.
  - **Mots déjà lus** : texte `#a4a097`.
  - **Mot douteux** (capture seulement) : fond `#f9e79f` et soulignement intérieur de 2 dp `#dd5b00`.
  - Transitions de 150 ms sur la couleur et le fond.
- Sous la zone, l'aide « Touche un mot pour lire à partir de là » (14 sp, `#787671`, centré).

**Sélecteur de vitesse :**
- Conteneur : fond blanc, bordure `#e5e3df`, rayon 20, padding 6, grille de 3 colonnes, gap 8.
- Chaque segment : hauteur 60, rayon 14, libellé (15 sp 600) au-dessus de la valeur (13 sp 500).
- Segment actif : fond `#1a1a1a`, texte blanc.

| Libellé | Vitesse | Délai par mot dans la maquette |
|---|---|---|
| Tortue | 0,5x | 840 ms |
| Promenade | 0,8x | 525 ms |
| Normal | 1x (par défaut) | 420 ms |

En production, la vitesse s'applique au débit de la synthèse vocale (TTS).

**Rangée du bas** (espace entre les éléments) :
- Perroquet `parrot-lit` dans un cercle de 72 dp.
- Bouton ▶ / ❚❚ : cercle de 100 dp, fond `#6246d9`, ombre `0 8px 20px -6px rgba(98,70,217,.5)`, icône de 40 à 42 dp.
- Un espace vide de 72 dp pour équilibrer la rangée.

### 4. Fin de lecture
- Fond `#fef7d6`.
- Au centre :
  - le perroquet `parrot-bravo` dans un cercle blanc de 240 dp ;
  - « Bravo ! » en 40 sp, 600, interlettrage −0,8 ;
  - une pastille blanche « +{n} mots lus » (20 sp 600).
- Deux boutons empilés, hauteur 76, rayon 22, icônes de 26 dp :
  - **Réécouter** : primaire violet, icône Lucide `rotate-ccw`. Relit depuis le début.
  - **Accueil** : fond blanc, bordure 2 dp `#1a1a1a`, icône Lucide `home`.

### 5. Réglages
**En-tête commun** : bouton retour 52 × 52 et titre 28 sp 600.
- Depuis Réglages, le retour mène à l'Accueil.
- Depuis un sous-écran, il mène à Réglages.

**Liste des réglages** (gap 12). Chaque ligne fait au moins 76 dp de haut : rayon 22, fond blanc, bordure `#e5e3df`, padding horizontal 18, avec une tuile d'icône de 44 × 44 (rayon 14).
1. **Langue** : tuile `#dcecfa`, icône `globe`. Valeur actuelle à droite (16 sp 500 `#5d5b54`) et chevron.
2. **Sons** : tuile `#ffe8d4`, icône `volume-2`. Titre et sous-titre « Petits sons du perroquet ».
   - Interrupteur 60 × 36 : fond `#6246d9` si actif, `#c8c4be` sinon ; pastille blanche de 28 dp.
3. **Sauvegarde** : tuile `#d9f3e1`, icône `upload`. Libellé « Exporter » et chevron.

En bas de l'écran : « Vocalire · 1.0 » (13 sp, `#a4a097`).

**Langue :**
- Deux options de 76 dp de haut, rayon 22 :
  - option active : fond `#e6e0f5`, bordure 2 dp `#6246d9`, coche ✓ ;
  - option inactive : fond blanc, bordure `#e5e3df`.
- Le changement est immédiat. Note sous les options : « Change la langue de l'application. Le texte lu reste en français. »

**Sauvegarde :**
- Carte `#dcecfa`, rayon 24 : « {n} lectures · {mots} mots » (22 sp 600) et une description.
- En bas, le gros bouton « Exporter » (80 dp). Il ouvre la **feuille de partage Android** avec le fichier de sauvegarde, une étape non simulée dans la maquette.

**Sauvegarde terminée :**
- Perroquet `parrot-ok` dans un cercle de 200 dp (fond `#d9f3e1`) et la bulle « C'est sauvegardé. ».
- Bouton « Retour aux réglages » : hauteur 72, contour.
- En cas d'échec : même écran, avec un message d'erreur et un bouton « Réessayer ».

---

## Interactions et comportement

### Navigation
```
Accueil ─ Nouvelle lecture ─► [Autorisation, 1re fois] ─► Caméra ─► Lecteur ─► ▶ ─► Fin ─► Accueil / Réécouter
   │                                                       ▲
   └─ appui sur une lecture ───────────────────────────────┘ (sans bandeau)
Accueil ─ ⚙ ─► Réglages ─► Langue | Sauvegarde ─► Terminé
```
- Une nouvelle lecture se fait en 2 appuis : « Nouvelle lecture », puis ▶. La capture est automatique.
- **Sauvegarde automatique** : la session est enregistrée au **premier ▶** (ou à « Lire quand même »), en tête de l'historique. Si l'apprenant quitte le Lecteur sans lancer la lecture, la capture n'est pas enregistrée.
- Le compteur « Mots lus » augmente du nombre de mots du texte à chaque lecture menée jusqu'à la fin.

### Lecture
- ▶ démarre ou reprend la lecture. ❚❚ la met en pause.
- Appuyer sur un mot relance la lecture à partir de ce mot, qu'elle soit en pause ou en cours.
- Changer de vitesse pendant la lecture continue depuis le mot en cours, sans repartir du début.
- Au dernier mot, l'écran Fin s'affiche.

### Animations
- Uniquement des transitions de couleur, de fond et d'opacité de 150 à 200 ms, en `ease`.
- Pas de rebond, pas d'animation d'entrée, pas de mise à l'échelle au toucher. L'état pressé correspond à une teinte plus foncée.

### Sons (`assets/sounds/`)
Le réglage « Sons » coupe tous ces effets, **jamais la voix de lecture**. Ils respectent aussi le mode silencieux du téléphone.

| Fichier | Déclencheur | Règle |
|---|---|---|
| son-salut.ogg | Arrivée sur l'Accueil | Une seule fois par ouverture de l'application |
| son-oups.ogg | Image floue détectée | Au plus une fois toutes les 3 s |
| son-declic.ogg | Capture (auto ou manuelle) | |
| son-doute.ogg | Ouverture du Lecteur avec des mots douteux | |
| son-mot.ogg | Appui sur un mot | Très discret |
| son-bravo.ogg | Fin de lecture | |
| son-ok.ogg | Export réussi, ou sons réactivés | |

### Accessibilité
- Contraste d'au moins 4,5:1 sur tout le texte. Les boutons utilisant seulement une icône ont un libellé accessible (`contentDescription`).
- Prendre en charge la taille de police du système ; le texte du Lecteur doit rester lisible jusqu'à 1,3×.

## Gestion d'état
```
lang: 'fr' | 'ar'                 // détectée d'après la langue du téléphone, persistée
soundOn: boolean                  // persisté
cameraPermission: granted | denied | unknown
sessions: Session[]               // persistées en local, la plus récente en premier
totalWordsRead: number            // persisté
camera: { phase: 'search' | 'blur' | 'sharp', capturing: boolean }
reader: { words: Word[], index: number, playing: boolean, speed: 0.5 | 0.8 | 1,
          fromCapture: boolean, showDoubtBanner: boolean, saved: boolean }

Session { id, createdAt, text, wordCount, imageUri? /* futur : image IA */, sourcePhotoUri }
Word    { text, start, end, doubtful: boolean } // doubtful : confiance OCR sous un seuil, à définir (≈ 0,6)
```
- **OCR** : sur l'appareil, par exemple ML Kit Text Recognition (latin). Un mot est douteux si sa confiance est sous le seuil.
- **Lecture** : TTS Android en `fr-FR`. Le surlignage se synchronise sur `onRangeStart` (API 26+). La vitesse règle `setSpeechRate`.
- **Export** : fichier JSON (ou zip si les photos sont incluses) contenant `sessions` et `totalWordsRead`, partagé via `Intent.ACTION_SEND`.
- **Hors MVP** : série de jours, image de vignette générée par IA (elle remplacera `vignette-defaut.svg` au même endroit), passage au mot suivant.

## Design tokens
Valeurs complètes dans `tokens.json`. L'essentiel :
- **Couleurs**
  - Primaire `#6246d9` (survol `#4f36bd`, appui `#3e2a9e`).
  - Textes : encre `#1a1a1a`, `#37352f`, `#5d5b54`, `#787671`, `#a4a097`.
  - Surfaces : `#ffffff`, `#f6f5f4`, `#fafaf9`. Bordures : `#e5e3df`, `#c8c4be`.
  - Bleu nuit de la Caméra : `#070f24` / `#1a2a52`.
  - Teintes pastel : pêche `#ffe8d4`, rose `#fde0ec`, menthe `#d9f3e1`, lavande `#e6e0f5`, ciel `#dcecfa`, jaune `#fef7d6`, jaune vif `#f9e79f`, crème `#f8f5e8`.
  - États : succès `#1aae39`, avertissement `#dd5b00`, erreur `#e03131`.
- **Typographie**
  - Inter (400, 500, 600) pour le latin, IBM Plex Sans Arabic (400, 500, 600) pour l'arabe. Les deux sont sur Google Fonts, sous licence OFL.
  - Titres en 600, boutons et libellés en 500 ou 600, texte courant en 400.
- **Rayons** : 8 (puces, mots) · 14 (segments, tuiles) · 16 (boutons icône) · 20 (lignes, bulles) · 22 (gros boutons, cartes) · 24 (papier du Lecteur) · 28 (dialogue) · 9999 (pastilles, perroquet).
- **Ombres** : à plat par défaut. Seuls la bulle et le bouton ▶ en ont une (voir `tokens.json`).
- Ces valeurs viennent du design system **Nodal**, assoupli pour un public d'apprenants de tout âge, peu familiers du numérique : coins plus ronds et cibles plus grandes.

## Ressources
- `assets/images/` (SVG fournis par le client) :
  - logo : voir `app/resources/logo.svg` ;
  - `vignette-defaut.svg` (portrait 3:4) ;
  - les 7 poses du perroquet : `parrot-salue`, `parrot-photo`, `parrot-oups`, `parrot-doute`, `parrot-lit`, `parrot-bravo`, `parrot-ok`. Elles s'affichent en `contain` dans des cercles.
  - Sur Android, convertir les SVG en Vector Drawables ou en PNG @1x à @4x selon le framework.
- `assets/sounds/` : les 7 effets en .ogg (voir le tableau des sons).
- **Icônes** : Lucide (contour de 2 dp) : `camera`, `settings`, `arrow-left`, `play`, `pause`, `rotate-ccw`, `home`, `globe`, `volume-2`, `upload`, `chevron-right`, `check`.
- Textes de l'interface : `app/src/i18n/fr.json` et `ar.json`. **Les textes arabes doivent être relus par un arabophone natif.**

## Fichiers
- `prototype/Vocalire App.dc.html` : l'application complète. Tous les écrans, l'état et la logique se trouvent dans la classe `Component` en bas du fichier.
- `prototype/Parcours 1 - Nouvelle lecture.dc.html` : premier lancement, autorisation, caméra, lecteur avec doutes, fin.
- `prototype/Parcours 2 - Reprise.dc.html` : reprise depuis l'historique.
- `prototype/Parcours 3 - Reglages.dc.html` : langue, sons, sauvegarde.
- `prototype/android-frame.jsx`, `image-slot.js`, `support.js`, `_ds/` : fichiers techniques du prototype, à ne pas porter.
- `tokens.json` : design tokens.
