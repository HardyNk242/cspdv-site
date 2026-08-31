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
DST = os.path.join(ICI, "public", "images", "bourses")

LARGEUR = 700
QUALITE = 82

# Les fichiers sont nommés par horodatage : l'ordre alphabétique est
# l'ordre de génération, qui suit l'ordre des prompts.
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


def dossier_source():
    annee = next(d for d in os.listdir(RACINE) if d.startswith("Demarrage"))
    base = os.path.join(RACINE, annee, "projet_cspdv", "affiche_bourses")
    images = next(d for d in os.listdir(base) if d.lower().startswith("images"))
    return os.path.join(base, images)


def main():
    src = dossier_source()
    os.makedirs(DST, exist_ok=True)
    noms = sorted(n for n in os.listdir(src) if n.lower().endswith(".png"))

    if len(noms) != len(SORTIES):
        print("ATTENTION : %d fichiers trouvés pour %d noms de sortie."
              % (len(noms), len(SORTIES)))
        print("Vérifiez la correspondance avant de publier.")

    total = 0
    for nom, sortie in zip(noms, SORTIES):
        im = Image.open(os.path.join(src, nom)).convert("RGB")
        if im.width > LARGEUR:
            im = im.resize((LARGEUR, round(im.height * LARGEUR / im.width)),
                           Image.LANCZOS)
        cible = os.path.join(DST, sortie + ".jpg")
        im.save(cible, quality=QUALITE, optimize=True, progressive=True)
        poids = os.path.getsize(cible) / 1024
        total += poids
        print("%-14s %4dx%-4d %6.0f ko" % (sortie, im.width, im.height, poids))

    print("\nTotal : %.0f ko dans %s" % (total, DST))


if __name__ == "__main__":
    main()
