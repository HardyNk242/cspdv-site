// =====================================================================
//  Tarifs et formules de bourse.
//  Source unique : constants.ts du logiciel de gestion CSPDV.
//  Si un tarif change là-bas, il doit changer ici — sinon le site ment.
//
//  Base de calcul d'une année : 8 mensualités d'octobre à mai,
//  plus le forfait du mois de juin.
// =====================================================================

export const TAUX_EURO = 700; // 1 € = 700 FCFA

export const fr = (n) => n.toLocaleString("fr-FR").replace(/ | /g, " ");
export const eur = (n) =>
  (n / TAUX_EURO).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Mensualités hors juin, puis forfait de juin.
// null = ce régime n'existe pas dans cette classe.
export const tarifs = [
  { classe: "Garderie", cycle: "Préscolaire", base: 15000, td: null, pt: 20000, juin: 3500 },
  { classe: "P1",       cycle: "Préscolaire", base: 5995,  td: null, pt: 11995, juin: 3500 },
  { classe: "P2-P3",    cycle: "Préscolaire", base: 5995,  td: null, pt: 11995, juin: 3500 },
  { classe: "CP1",      cycle: "Primaire",    base: 5995,  td: 7500, pt: 11995, juin: 3500 },
  { classe: "CP2",      cycle: "Primaire",    base: 5995,  td: 7500, pt: 11995, juin: 3500 },
  { classe: "CE1",      cycle: "Primaire",    base: 5995,  td: 7500, pt: 11995, juin: 3500 },
  { classe: "CE2",      cycle: "Primaire",    base: 5995,  td: 7500, pt: 11995, juin: 3500 },
  { classe: "CM1",      cycle: "Primaire",    base: 6995,  td: 7500, pt: 11995, juin: 3500 },
  { classe: "CM2",      cycle: "Primaire",    base: 9000,  td: 9000, pt: 12000, juin: 9000 },
  { classe: "6ème",     cycle: "Collège",     base: 7995,  td: null, pt: null,  juin: 5000 },
  { classe: "5ème",     cycle: "Collège",     base: 7995,  td: null, pt: null,  juin: 5000 },
  { classe: "4ème",     cycle: "Collège",     base: 7995,  td: null, pt: null,  juin: 5000 },
  { classe: "3ème",     cycle: "Collège",     base: 13500, td: 13500, pt: 13500, juin: 13500 },
];

export const annexes = [
  { poste: "Inscription (nouvel élève)", montant: 1500 },
  { poste: "Réinscription (ancien élève)", montant: 1000 },
  { poste: "Cotisations des trois fêtes", montant: 9000,
    detail: "Noël, fête de l'école et sortie scolaire — 3 000 F chacune" },
  { poste: "Équipement scolaire", montant: 16500,
    detail: "Tenue 3 500, sac à dos 3 000, livres 5 000, cahiers et divers 5 000" },
  { poste: "Frais d'examen du CEPE", montant: 12000, detail: "Élèves de CM2" },
  { poste: "Frais d'examen du BEPC", montant: 16500, detail: "Élèves de 3ème" },
  { poste: "Frais informatique, primaire", montant: 1000, detail: "CE2, CM1, CM2" },
  { poste: "Frais informatique, collège", montant: 2000, detail: "6ème à 3ème" },
  { poste: "Morceaux choisis", montant: 1500 },
];

// ---------------------------------------------------------------------
//  LES DOUZE FORMULES DE BOURSE
//  Montants issus du bootstrap des 100 cas : voir
//  projet_cspdv/affiche_bourses/bootstrap_cas_de_bourses.md
// ---------------------------------------------------------------------
// `image` renvoie à public/images/bourses/. Quatre formules n'ont pas
// encore d'affiche : elles s'affichent sans visuel, sans casser la page.
export const bourses = [
  { nom: "Bourse d'activités",    montant: 9000,   image: "activites.jpg",
    texte: "Les trois fêtes de l'année pour un enfant." },
  { nom: "Bourse mensuelle",      montant: 11995,  image: "mensuelle.jpg",
    texte: "Un mois de classe à plein temps." },
  { nom: "Bourse d'examen",       montant: 12000, montantAlt: 16500,
    image: "examen-cepe.jpg", imageAlt: "examen-bepc.jpg",
    texte: "Les frais d'examen : 12 000 F pour le CEPE, 16 500 F pour le BEPC." },
  { nom: "Bourse d'équipement",   montant: 16500,  image: "equipement.jpg",
    texte: "Tenue scolaire, sac à dos, livres, cahiers et fournitures." },
  { nom: "Bourse trimestrielle",  montant: 17985,
    texte: "Un trimestre de classe à mi-temps." },
  { nom: "Bourse semestrielle",   montant: 30730,  image: "semestrielle.jpg",
    texte: "Une demi-année à mi-temps, frais annexes compris." },
  { nom: "Bourse modérée",        montant: 61460,  image: "moderee.jpg", phare: true,
    texte: "Une année entière à mi-temps sans travaux dirigés, tout compris." },
  { nom: "Bourse renforcée",      montant: 73500,
    texte: "Une année entière à mi-temps avec travaux dirigés." },
  { nom: "Bourse collégienne",    montant: 95460,  image: "collegienne.jpg",
    texte: "Une année au collège, de la 6ème à la 4ème, tout compris." },
  { nom: "Bourse complète",       montant: 125960, image: "complete.jpg", phare: true,
    texte: "Une année à plein temps au primaire, équipement et fêtes compris." },
  { nom: "Bourse diplômante",     montant: 164500,
    texte: "Une année de 3ème, frais du BEPC et équipement compris." },
  { nom: "Bourse petite enfance", montant: 190000,
    texte: "Une année de Garderie à plein temps, tout compris." },
];

// Qualificatifs qui se combinent avec n'importe quelle formule.
export const modalites = [
  { mot: "fixe", texte: "un versement mensuel régulier, sur les neuf mois" },
  { mot: "ponctuelle", texte: "un versement unique, en une fois" },
  { mot: "nominative", texte: "affectée à un enfant désigné, qui reçoit sa fiche" },
];
