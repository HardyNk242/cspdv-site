# -*- coding: utf-8 -*-
"""
Prépare les images du site à partir des photos déjà traitées pour la bâche.

Celles-ci sont calibrées pour l'impression : le bandeau fait 3622 px de
large et pèse plus d'un mégaoctet. Sur un site consulté depuis Brazzaville,
souvent en 3G, c'est disqualifiant. On les redimensionne à 1200 px de large
au maximum et on les recompresse en qualité 80 : à l'écran la différence
ne se voit pas, le poids est divisé par cinq.

Usage :  python scripts/preparer_images_web.py
"""
import os
import shutil
from PIL import Image

ICI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(os.path.dirname(ICI), "Demarrage année scolaire",
                   "projet_cspdv", "affiche_annee", "photos")
LOGO = os.path.join(os.path.dirname(ICI), "Demarrage année scolaire",
                    "projet_cspdv", "affiche_annee", "logo_sceau.png")
DST = os.path.join(ICI, "site", "images")

LARGEUR_MAX = 1200
QUALITE = 80

# Nom de sortie -> (fichier source, légende affichée sur le site)
IMAGES = {
    "banniere":      ("hero.jpg",     "La troupe de danse devant toute l'école"),
    "danse-groupe":  ("tuile01.jpg",  "Les grandes ouvrent la fête"),
    "danse-couple":  ("tuile02.jpg",  "Danse traditionnelle"),
    "discours":      ("tuile03.jpg",  "Discours de la cérémonie d'émulation"),
    "eleve-micro":   ("tuile04.jpg",  "Une élève récite devant l'assemblée"),
    "remise-prix":   ("tuile05.jpg",  "Remise des prix aux lauréats"),
    "remise-lot":    ("tuile06.jpg",  "Un lot remis à une famille"),
    "cantine":       ("tuile07.jpg",  "Le repas, à la cantine de l'école"),
    "sortie-parc":   ("tuile08.jpg",  "Sortie scolaire au parc"),
    "sortie-jeux":   ("tuile09.jpg",  "Aire de jeux, sortie de fin d'année"),
}


def main():
    os.makedirs(DST, exist_ok=True)
    if not os.path.isdir(SRC):
        raise SystemExit("Dossier source introuvable :\n  " + SRC)

    total = 0
    for sortie, (source, _legende) in IMAGES.items():
        chemin = os.path.join(SRC, source)
        if not os.path.exists(chemin):
            print("MANQUANT :", source)
            continue
        im = Image.open(chemin).convert("RGB")
        if im.width > LARGEUR_MAX:
            hauteur = round(im.height * LARGEUR_MAX / im.width)
            im = im.resize((LARGEUR_MAX, hauteur), Image.LANCZOS)
        cible = os.path.join(DST, sortie + ".jpg")
        im.save(cible, quality=QUALITE, optimize=True, progressive=True)
        poids = os.path.getsize(cible) / 1024
        total += poids
        print("%-14s %-14s %4dx%-4d %6.0f ko" % (sortie, source, im.width, im.height, poids))

    if os.path.exists(LOGO):
        shutil.copy2(LOGO, os.path.join(DST, "logo.png"))
        print("%-14s %-14s %s" % ("logo", "logo_sceau.png", "copié"))

    print("\nTotal des photos : %.0f ko" % total)


if __name__ == "__main__":
    main()
