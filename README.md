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

## Modifier le site

**Tout le contenu est dans deux fichiers.** Aucun texte n'est écrit en dur
dans les pages.

| Fichier | Ce qu'on y change |
|---|---|
| `src/data/ecole.js` | Identité, cycles, résultats aux examens, galerie, donateurs |
| `src/data/finances.js` | Tarifs par classe, frais annexes, formules de bourse |

Les tarifs viennent de `constants.ts` du logiciel de gestion CSPDV.
**Si un tarif y change, il faut le reporter ici**, sinon le site ment.

## Publier une modification

```bash
git add .
git commit -m "Description du changement"
git push
```

GitHub reconstruit et met en ligne automatiquement, en deux minutes environ.
L'avancement est visible dans l'onglet **Actions** du dépôt.

## Travailler en local

```bash
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:5173/

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
- **Le routeur est un `HashRouter`** : les adresses contiennent un `#`
  (`/#/bourses`). C'est voulu — sans lui, un lien direct vers une page
  renverrait une erreur 404 sur GitHub Pages.

## Vie privée

- La page Donateurs nomme les donateurs et le nombre d'enfants qu'ils
  soutiennent. **Jamais les montants versés, jamais le nom des boursiers.**
- La galerie porte une mention permettant à une famille de demander le
  retrait d'une photo.

---

Construit avec React et Vite.
