// =====================================================================
//  Identité de l'école, contacts, résultats, galerie et donateurs.
//  C'est l'un des deux seuls fichiers à modifier pour mettre le site
//  à jour. On lance ensuite : node construire.js
// =====================================================================

export const ecole = {
  nom: "Complexe Scolaire Professeur Dieu-Veille",
  nomCourt: "CSPDV",
  devise: "Préscolaire · Primaire · Collège",
  email: "professeurdieuveille@gmail.com",
  anneeScolaire: "2026-2027",
  site: "https://ecole.kongoscience.com",
};

export const adresse = {
  rue: "6 rue Konda, case Barnier",
  quartier: "Sadelmi, Mfilou",
  ville: "Brazzaville",
  pays: "République du Congo",
  carte: "https://maps.app.goo.gl/7wPwyZQ5sHwuaL6G6",
};

// `intl` sert aux liens tel: et WhatsApp. Au Congo-Brazzaville le zéro
// initial se CONSERVE en format international : +242 06 ... et non +242 6 ...
// Un lien wa.me sans ce zéro tombe sur un numéro inexistant.
export const contacts = [
  {
    numero: "06 412 64 21",
    intl: "242064126421",
    role: "Gestionnaire de l'école",
    personne: "Madame Goma Nuptia",
    note: "Inscriptions, paiements et reçus",
  },
  {
    numero: "06 719 21 95",
    intl: "242067192195",
    role: "Assistant du Directeur",
    personne: "Monsieur Chiroll Makenda",
    note: "Scolarité, vie de l'école",
  },
  {
    numero: "06 828 90 09",
    intl: "242068289009",
    role: "Directrice des Affaires Financières",
    personne: null,
    note: "Parrainages et suivi des dons",
  },
];

export const cycles = [
  {
    nom: "Préscolaire",
    classes: "Garderie, P1, P2-P3",
    texte:
      "Les premières années d'école, où l'enfant apprend à tenir un crayon, " +
      "à écouter et à vivre en groupe. Journée complète ou demi-journée.",
  },
  {
    nom: "Primaire",
    classes: "CP1, CP2, CE1, CE2, CM1, CM2",
    texte:
      "Le cœur de l'école. Trois régimes possibles : mi-temps, mi-temps avec " +
      "travaux dirigés, ou plein temps. Le CM2 se termine par le CEPE.",
  },
  {
    nom: "Collège",
    classes: "6ème, 5ème, 4ème, 3ème",
    texte:
      "Un tarif unique par niveau, travaux dirigés compris. La 3ème prépare " +
      "le BEPC.",
  },
];

// Résultats aux examens d'État. Ne rien ajouter avant proclamation.
export const resultats = [
  { annee: "2024-2025", cepe: "100 %", bepc: "64 %" },
  { annee: "2025-2026", cepe: "100 %", bepc: null }, // null = en cours
];

export const galerie = [
  { fichier: "danse-groupe.jpg", legende: "Les grandes ouvrent la fête" },
  { fichier: "danse-couple.jpg", legende: "Danse traditionnelle" },
  { fichier: "discours.jpg", legende: "Discours de la cérémonie d'émulation" },
  { fichier: "eleve-micro.jpg", legende: "Une élève récite devant l'assemblée" },
  { fichier: "remise-prix.jpg", legende: "Remise des prix aux lauréats" },
  { fichier: "remise-lot.jpg", legende: "Un lot remis à une famille" },
  { fichier: "cantine.jpg", legende: "Le repas, à la cantine de l'école" },
  { fichier: "sortie-parc.jpg", legende: "Sortie scolaire au parc" },
  { fichier: "sortie-jeux.jpg", legende: "Aire de jeux, sortie de fin d'année" },
];

// ---------------------------------------------------------------------
//  DONATEURS — volontairement SANS montants : on publie qui soutient
//  l'école et combien d'enfants, jamais ce que chacun verse, jamais le
//  nom des boursiers.
// ---------------------------------------------------------------------
export const donateurs = [
  { nom: "M. Nicy Bazebinzona", eleves: 5, niveaux: "du CP2 au CM2" },
  { nom: "Madame Imen Arfaoui", eleves: 3, niveaux: "du CP2 à la 6ème" },
  { nom: "Damien et Véronique", eleves: 2, niveaux: "CP2" },
  { nom: "Madame Pascale Lahogue", eleves: 1, niveaux: "CE1" },
  { nom: "Madame Clara Nagaleybaye", eleves: 1, niveaux: "CM1" },
  { nom: "Monsieur San Bayekola, ingénieur", eleves: 1, niveaux: "CE2" },
  { nom: "Camille François", eleves: 1, niveaux: "CM2" },
];

export const totalBoursiers = donateurs.reduce((n, d) => n + d.eleves, 0);
