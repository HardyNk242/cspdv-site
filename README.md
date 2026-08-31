# Site du Complexe Scolaire Professeur Dieu-Veille

Site public de l'école — Brazzaville, République du Congo.
Préscolaire, primaire et collège.

**En ligne :** https://ecole.kongoscience.com

---

## Ce qu'il contient

| Page | Contenu |
|---|---|
| Accueil | Présentation, chiffres, résultats aux examens, appel aux bourses |
| L'école | Les trois cycles, les régimes de scolarité, la vie de l'école |
| Tarifs | Mensualités par classe, coût d'une année complète, frais annexes |
| Bourses | Les douze formules de parrainage, avec leur affiche |
| Donateurs | Qui soutient l'école, et comment l'argent est suivi |
| Galerie | Photographies de l'année |
| Contact | Téléphones et informations pratiques |

## Comment c'est fait

**HTML statique, aucune dépendance.** Un générateur Node d'un seul fichier
(`construire.js`) lit les données et écrit sept pages HTML dans `site/`.
Pas de framework, pas de `npm install`, pas de `node_modules`.

Le choix vient d'un constat : en React, les adresses contenaient un `#`,
et Google ignore tout ce qui suit un `#`. Le site n'avait donc qu'**une
seule page indexable** au lieu de sept, et son contenu n'apparaissait
qu'après exécution du JavaScript. En HTML statique, les sept pages
existent vraiment.

## Modifier le site

**Tout le contenu est dans deux fichiers.** Aucun texte n'est écrit en dur
dans les pages.

| Fichier | Ce qu'on y change |
|---|---|
| `donnees/ecole.js` | Identité, adresse, contacts, cycles, résultats, galerie, donateurs |
| `donnees/finances.js` | Tarifs par classe, frais annexes, formules de bourse |

Après modification : `node construire.js`, puis `git push`.

Les tarifs viennent de `constants.ts` du logiciel de gestion CSPDV.
**Si un tarif y change, il faut le reporter ici**, sinon le site ment.

## Publier une modification

```bash
git add .
git commit -m "Description du changement"
git push
```

GitHub régénère le HTML et met en ligne automatiquement, en une trentaine
de secondes.
L'avancement est visible dans l'onglet **Actions** du dépôt.

## Travailler en local

```bash
node construire.js
python -m http.server 8899 --directory site
```

Le site s'ouvre sur http://localhost:8899/

## Renouveler les images

Les photographies et les affiches de bourses sont générées depuis les
dossiers de travail hors dépôt :

```bash
python scripts/preparer_images_web.py      # photos de l'année
python scripts/preparer_flyers_bourses.py  # affiches des bourses
```

Les deux scripts redimensionnent et recompressent : les originaux
d'impression pèsent trop lourd pour une consultation depuis Brazzaville.

## Pièges

- **`base` dans `vite.config.js`** vaut `/` parce que le site est servi sur
  son propre domaine. Si le domaine était retiré et le site rendu à
  `hardynk242.github.io/cspdv-site/`, il faudrait y remettre `/cspdv-site/`,
  sinon plus aucune image ne s'affiche.
- **`public/CNAME`** contient `ecole.kongoscience.com`. Ne pas le supprimer :
  c'est lui qui rattache le domaine au dépôt.
- **`site/` est versionné**, contrairement à l'usage. C'est délibéré :
  si le générateur cassait, le dernier site produit resterait dans le
  dépôt et en ligne.
- **Les anciennes adresses en `#/`** (du temps de React) sont redirigées
  par `site/menu.js`. Ne pas supprimer ce bloc : des liens ont été
  partagés sous cette forme.

## Vie privée

- La page Donateurs nomme les donateurs et le nombre d'enfants qu'ils
  soutiennent. **Jamais les montants versés, jamais le nom des boursiers.**
- La galerie porte une mention permettant à une famille de demander le
  retrait d'une photo.

---

HTML, CSS et un peu de JavaScript. Généré par `construire.js`.
