# -*- coding: utf-8 -*-
"""
Prépare les flyers de bourses générés pour le web.

Les originaux font environ 2 Mo chacun en PNG — 20 Mo pour la page, ce qui
est impraticable depuis Brazzaville. On les passe en JPEG 700 px de large :
la page entière tombe sous le mégaoctet.

Le dossier source porte des accents que Windows stocke en forme décomposée :
on le retrouve par préfixe au lieu de l'écrire en dur.

Usage :  python scripts/preparer_flyers_bourses.py
"""
import os
from PIL import Image

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RACINE = os.path.dirname(ICI)
DST = os.path.join(ICI, "site", "images", "bourses")

LARGEUR = 700
QUALITE = 82

# Les dix premières affiches sont nommées par horodatage : leur ordre
# alphabétique est l'ordre de génération, qui suit l'ordre des prompts.
SORTIES = [
    "appel",           # 1  Offrez une bourse scolaire
    "complete",        # 2  Une année entière        125 960
    "collegienne",     # 3  Une année au collège      95 460
    "moderee",         # 4  Une année à mi-temps      61 460
    "semestrielle",    # 5  Une demi-année            30 730
    "equipement",      # 6  Le cartable et les livres 16 500
    "examen-bepc",     # 7  Frais du BEPC             16 500
    "examen-cepe",     # 8  Frais du CEPE             12 000
    "mensuelle",       # 9  Un mois de classe         11 995
    "activites",       # 10 Noël et la fête            9 000
]

# Les quatre affiches ajoutées ensuite sont reprises À LEUR NOM, sans
# dépendre de l'ordre : un horodatage supplémentaire aurait décalé toute
# la liste ci-dessus et attribué le mauvais montant à chaque affiche.
NOMMEES = ["diplomante", "renforcee", "petite-enfance", "trimestrielle"]


def cle(nom_fichier):
    """Ramène un nom de fichier à sa clé, quelle qu'en soit la forme.

    Les fichiers arrivent tels que le générateur d'images les nomme :
    « Bourse_trimestrielle.png », « Bourse petite enfance.png », et même
    « Bourse_renforcee..png » avec deux points. Exiger un nom exact
    obligerait à renommer à la main à chaque fois — et un oubli
    attribuerait le mauvais montant à une affiche.
    """
    stem = os.path.splitext(nom_fichier)[0].lower()
    for a, b in (("é", "e"), ("è", "e"), ("ê", "e"), ("à", "a"), ("ô", "o")):
        stem = stem.replace(a, b)
    stem = stem.replace("_", "-").replace(" ", "-")
    stem = stem.strip(".-")                       # « renforcee. » -> « renforcee »
    if stem.startswith("bourse-"):
        stem = stem[len("bourse-"):]
    return stem.strip(".-")


def dossier_source():
    annee = next(d for d in os.listdir(RACINE) if d.startswith("Demarrage"))
    base = os.path.join(RACINE, annee, "projet_cspdv", "affiche_bourses")
    images = next(d for d in os.listdir(base) if d.lower().startswith("images"))
    return os.path.join(base, images)


def convertir(chemin, sortie):
    im = Image.open(chemin).convert("RGB")
    if im.width > LARGEUR:
        im = im.resize((LARGEUR, round(im.height * LARGEUR / im.width)),
                       Image.LANCZOS)
    cible = os.path.join(DST, sortie + ".jpg")
    im.save(cible, quality=QUALITE, optimize=True, progressive=True)
    poids = os.path.getsize(cible) / 1024
    print("%-15s %4dx%-4d %6.0f ko" % (sortie, im.width, im.height, poids))
    return poids


def main():
    src = dossier_source()
    os.makedirs(DST, exist_ok=True)
    tous = [n for n in os.listdir(src) if n.lower().endswith(".png")]

    # On met de côté les affiches portant déjà leur nom, pour ne pas
    # décaler la liste ordonnée.
    par_nom = {cle(n): n for n in tous}
    horodatees = sorted(n for n in tous if cle(n) not in NOMMEES)

    if len(horodatees) != len(SORTIES):
        print("ATTENTION : %d affiches horodatées pour %d attendues."
              % (len(horodatees), len(SORTIES)))
        print("Vérifiez la correspondance avant de publier.\n")

    total = 0
    for nom, sortie in zip(horodatees, SORTIES):
        total += convertir(os.path.join(src, nom), sortie)

    for sortie in NOMMEES:
        if sortie in par_nom:
            total += convertir(os.path.join(src, par_nom[sortie]), sortie)
        else:
            print("%-15s %s" % (sortie, "— pas encore générée"))

    print("\nTotal : %.0f ko dans %s" % (total, DST))


if __name__ == "__main__":
    main()
