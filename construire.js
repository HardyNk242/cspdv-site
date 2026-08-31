/* =====================================================================
   GÉNÉRATEUR DU SITE — HTML pur, aucune dépendance

   Pourquoi un générateur plutôt que sept fichiers écrits à la main :
   le menu, le pied de page et les tarifs sont répétés sur chaque page.
   Recopiés sept fois, ils divergent au premier changement. Ici ils
   n'existent qu'une fois.

   Ce qui SORT est du HTML statique, sans framework et sans JavaScript
   nécessaire à l'affichage : c'est exactement ce que Google indexe le
   mieux. Le seul script embarqué ouvre le menu sur téléphone.

   Usage :  node construire.js
   Sortie : site/
   ===================================================================== */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  ecole, adresse, contacts, cycles, resultats, galerie,
  donateurs, totalBoursiers,
} from "./donnees/ecole.js";
import { tarifs, annexes, bourses, modalites, fr, eur, TAUX_EURO } from "./donnees/finances.js";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const SORTIE = path.join(ICI, "site");

// Échappe le texte inséré dans le HTML. Sans cela, une apostrophe ou un
// « & » dans un nom de donateur casserait la page.
const e = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const PAGES = [
  { fichier: "index.html",     lien: "/",              libelle: "Accueil" },
  { fichier: "ecole.html",     lien: "/ecole.html",     libelle: "L'école" },
  { fichier: "tarifs.html",    lien: "/tarifs.html",    libelle: "Tarifs" },
  { fichier: "bourses.html",   lien: "/bourses.html",   libelle: "Bourses" },
  { fichier: "donateurs.html", lien: "/donateurs.html", libelle: "Donateurs" },
  { fichier: "galerie.html",   lien: "/galerie.html",   libelle: "Galerie" },
  { fichier: "contact.html",   lien: "/contact.html",   libelle: "Contact" },
];

const wa = (c) => `https://wa.me/${c.intl}`;
const tel = (c) => `tel:+${c.intl}`;

// ---------------------------------------------------------------------
//  Données structurées : c'est ce bloc qui dit à Google « ceci est une
//  ÉCOLE, à Brazzaville, qui accepte des dons ». Sans lui, il devine.
// ---------------------------------------------------------------------
const donneesStructurees = () =>
  JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "School",
      name: ecole.nom,
      alternateName: ecole.nomCourt,
      url: ecole.site,
      email: ecole.email,
      telephone: contacts.map((c) => "+" + c.intl),
      logo: ecole.site + "/images/logo.png",
      image: ecole.site + "/images/banniere.jpg",
      description:
        "École préscolaire, primaire et collège à Brazzaville, République " +
        "du Congo. 100 % de réussite au CEPE. Parrainage scolaire ouvert " +
        "à partir de 12,86 €.",
      address: {
        "@type": "PostalAddress",
        streetAddress: adresse.rue,
        addressLocality: adresse.quartier + ", " + adresse.ville,
        addressRegion: adresse.ville,
        addressCountry: "CG",
      },
      hasMap: adresse.carte,
      areaServed: { "@type": "City", name: adresse.ville },
      knowsLanguage: "fr",
      makesOffer: bourses.map((b) => ({
        "@type": "Offer",
        name: b.nom,
        description: b.texte,
        price: b.montant,
        priceCurrency: "XAF",
      })),
    },
    null,
    2
  );

// ---------------------------------------------------------------------
//  Gabarit commun
// ---------------------------------------------------------------------
function page({ fichier, titre, description, corps }) {
  const actif = (p) => (p.fichier === fichier ? ' class="actif" aria-current="page"' : "");
  const canonique = ecole.site + (fichier === "index.html" ? "/" : "/" + fichier);

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(titre)}</title>
<meta name="description" content="${e(description)}">
<link rel="canonical" href="${canonique}">
<meta name="theme-color" content="#000000">
<link rel="icon" type="image/png" href="/images/logo.png">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${e(ecole.nom)}">
<meta property="og:title" content="${e(titre)}">
<meta property="og:description" content="${e(description)}">
<meta property="og:url" content="${canonique}">
<meta property="og:image" content="${ecole.site}/images/banniere.jpg">
<meta property="og:locale" content="fr_FR">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">

<script type="application/ld+json">
${donneesStructurees()}
</script>
</head>
<body>

<nav class="navbar">
  <div class="conteneur navbar-inner">
    <a href="/" class="marque">
      <img src="/images/logo.png" alt="Logo du ${e(ecole.nom)}" width="40" height="40">
      <span>
        <span class="marque-nom">Professeur Dieu-Veille</span><br>
        <span class="marque-sous">${e(adresse.ville)}</span>
      </span>
    </a>
    <button class="burger" id="burger" aria-expanded="false" aria-controls="liens" aria-label="Ouvrir le menu">☰</button>
    <div class="liens" id="liens">
      ${PAGES.map((p) => `<a href="${p.lien}"${actif(p)}>${e(p.libelle)}</a>`).join("\n      ")}
    </div>
  </div>
</nav>

<main>
${corps}
</main>

<footer class="footer">
  <div class="conteneur">
    <div class="grille grille-3">
      <div>
        <h4>${e(ecole.nom)}</h4>
        <p>${e(adresse.rue)}<br>${e(adresse.quartier)}<br>${e(adresse.ville)}, ${e(adresse.pays)}</p>
        <p><a href="${adresse.carte}" target="_blank" rel="noopener">Voir sur Google Maps</a></p>
      </div>
      <div>
        <h4>Nous joindre</h4>
        ${contacts.map((c) => `<a href="${wa(c)}" target="_blank" rel="noopener">${e(c.numero)} — WhatsApp</a>`).join("\n        ")}
        <a href="mailto:${ecole.email}">${e(ecole.email)}</a>
      </div>
      <div>
        <h4>Le site</h4>
        ${PAGES.slice(1).map((p) => `<a href="${p.lien}">${e(p.libelle)}</a>`).join("\n        ")}
      </div>
    </div>
    <div class="footer-bas">
      <span>© ${new Date().getFullYear()} ${e(ecole.nom)}</span>
      <span>Année scolaire ${e(ecole.anneeScolaire)}</span>
    </div>
  </div>
</footer>

<script src="/menu.js" defer></script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------
//  Briques réutilisées par les pages
// ---------------------------------------------------------------------
const hero = (titre, accroche, boutons = "") => `
<div class="hero">
  <img class="fond" src="/images/banniere.jpg" alt="" width="1200" height="339">
  <div class="hero-contenu conteneur">
    <h1>${e(titre)}</h1>
    <p class="accroche">${accroche}</p>
    ${boutons}
  </div>
</div>`;

const enTete = (titre, accroche) => `
<div class="hero">
  <img class="fond" src="/images/banniere.jpg" alt="" width="1200" height="339">
  <div class="hero-contenu conteneur" style="padding:78px 28px">
    <h1 style="font-size:clamp(1.9rem,5vw,3rem)">${e(titre)}</h1>
    <p class="accroche" style="margin-bottom:0">${accroche}</p>
  </div>
</div>`;

const section = ({ titre, chapeau, claire, contenu }) => `
<section class="section${claire ? " section-claire" : ""}">
  <div class="conteneur">
    ${titre ? `<h2>${e(titre)}</h2><div class="barre"></div>` : ""}
    ${chapeau ? `<p class="chapeau">${chapeau}</p>` : ""}
    ${contenu}
  </div>
</section>`;

const cartesCycles = () =>
  `<div class="grille grille-3">` +
  cycles
    .map(
      (c) => `<article class="carte">
      <div class="classes">${e(c.classes)}</div>
      <h3>${e(c.nom)}</h3>
      <p>${e(c.texte)}</p>
    </article>`
    )
    .join("") +
  `</div>`;

const tableauResultats = () => `
<div class="tableau-enveloppe">
  <table>
    <thead><tr><th>Année scolaire</th><th class="nombre">CEPE</th><th class="nombre">BEPC</th></tr></thead>
    <tbody>
      ${resultats
        .map(
          (r) => `<tr>
        <td>${e(r.annee)}</td>
        <td class="nombre"><strong>${e(r.cepe)}</strong></td>
        <td class="nombre">${r.bepc ? `<strong>${e(r.bepc)}</strong>` : `<em>résultats en cours</em>`}</td>
      </tr>`
        )
        .join("")}
    </tbody>
  </table>
</div>`;

// Une année complète = 8 mensualités + le forfait de juin.
const annee = (mensuel, juin) => (mensuel === null ? null : 8 * mensuel + juin);

const encart = (titre, texte, lien, libelle) => `
<div class="encart">
  <h2>${e(titre)}</h2>
  <p>${e(texte)}</p>
  <a class="btn" href="${lien}">${e(libelle)}</a>
</div>`;

// ---------------------------------------------------------------------
//  LES SEPT PAGES
// ---------------------------------------------------------------------
const pages = [];

// ---- Accueil ----
pages.push({
  fichier: "index.html",
  titre: `${ecole.nom} — École à Brazzaville`,
  description:
    `École préscolaire, primaire et collège au ${adresse.rue}, ${adresse.quartier}, ` +
    `${adresse.ville}. 100 % de réussite au CEPE. Parrainage scolaire à partir de 12,86 €.`,
  corps:
    hero(
      ecole.nom,
      `Une école ${e(ecole.devise.toLowerCase())} à ${e(adresse.ville)}, où chaque enfant est suivi nommément — sa classe, son régime, ce qui est payé.`,
      `<div class="boutons">
        <a class="btn" href="/bourses.html">Offrir une bourse</a>
        <a class="btn btn-contour" href="/tarifs.html">Voir les tarifs</a>
      </div>`
    ) +
    section({
      claire: true,
      contenu: `<div class="chiffres">
        <div class="chiffre"><div class="valeur">3</div><div class="libelle">cycles, de la Garderie à la 3ème</div></div>
        <div class="chiffre"><div class="valeur">${totalBoursiers}</div><div class="libelle">enfants boursiers cette année</div></div>
        <div class="chiffre"><div class="valeur">${donateurs.length}</div><div class="libelle">donateurs qui les soutiennent</div></div>
        <div class="chiffre"><div class="valeur">100 %</div><div class="libelle">de réussite au CEPE</div></div>
      </div>`,
    }) +
    section({
      titre: "Trois cycles sous un même toit",
      chapeau: "L'enfant entre à la Garderie et sort avec son brevet, sans changer d'établissement.",
      contenu: cartesCycles(),
    }) +
    section({
      claire: true,
      titre: "Nos résultats aux examens d'État",
      chapeau: "Publiés tels que proclamés. Rien n'est ajouté avant la proclamation officielle.",
      contenu: tableauResultats(),
    }) +
    section({
      titre: "Parrainer un enfant",
      chapeau:
        "Douze formules, de 12,86 € à 271,43 €. Chaque franc est affecté à un enfant nommé, et chaque versement fait l'objet d'un reçu numéroté.",
      contenu:
        `<div class="grille grille-2 bourses-grille">` +
        bourses
          .filter((b) => b.phare)
          .map(
            (b) => `<article class="bourse phare">
            <h3>${e(b.nom)}</h3>
            <div class="prix">${fr(b.montant)} F<small>soit ${eur(b.montant)} €</small></div>
            <p>${e(b.texte)}</p>
          </article>`
          )
          .join("") +
        `</div><div style="margin-top:34px"><a class="btn btn-bleu" href="/bourses.html">Voir les douze formules</a></div>`,
    }) +
    section({
      claire: true,
      titre: "L'année en images",
      contenu:
        `<div class="galerie">` +
        galerie
          .slice(0, 6)
          .map(
            (p) => `<figure class="photo">
            <img src="/images/${p.fichier}" alt="${e(p.legende)}" loading="lazy" width="1185" height="835">
            <figcaption>${e(p.legende)}</figcaption>
          </figure>`
          )
          .join("") +
        `</div><div style="margin-top:34px"><a class="btn btn-bleu" href="/galerie.html">Toutes les photos</a></div>`,
    }) +
    section({
      contenu: encart(
        "Inscriptions ouvertes",
        `Année scolaire ${ecole.anneeScolaire}. Contactez la Direction pour connaître les places disponibles dans chaque classe.`,
        "/contact.html",
        "Nous joindre"
      ),
    }),
});

// ---- L'école ----
pages.push({
  fichier: "ecole.html",
  titre: "L'école — Préscolaire, primaire et collège à Brazzaville",
  description:
    "Les trois cycles du Complexe Scolaire Professeur Dieu-Veille à Mfilou, Brazzaville : " +
    "préscolaire, primaire et collège. Mi-temps, travaux dirigés ou plein temps.",
  corps:
    enTete(
      "L'école",
      `${e(ecole.devise)} — un enfant entre à la Garderie et sort avec son brevet, sans changer d'établissement.`
    ) +
    section({ titre: "Les trois cycles", contenu: cartesCycles() }) +
    section({
      claire: true,
      titre: "Les régimes de scolarité",
      chapeau: "Au primaire, la famille choisit selon ses moyens et selon l'enfant.",
      contenu: `<div class="grille grille-3">
        <article class="carte"><h3>Mi-temps</h3><p>Une demi-journée de classe. C'est le régime le plus accessible ; l'enfant suit le même programme, sur une demi-journée.</p></article>
        <article class="carte"><h3>Mi-temps avec travaux dirigés</h3><p>La demi-journée de classe, plus des séances d'accompagnement. Utile aux élèves qui ont besoin d'être repris.</p></article>
        <article class="carte"><h3>Plein temps</h3><p>La journée entière à l'école, travaux dirigés compris. Au collège, ce régime n'existe pas : un tarif unique s'applique.</p></article>
      </div>`,
    }) +
    section({
      titre: "La vie de l'école",
      chapeau: "Trois moments rythment l'année, financés par une cotisation distincte des frais de scolarité.",
      contenu: `<div class="galerie">
        <figure class="photo"><img src="/images/discours.jpg" alt="Cérémonie d'émulation" loading="lazy" width="1185" height="835"><figcaption><strong>La cérémonie d'émulation</strong> — les résultats sont proclamés devant toute l'école et les familles.</figcaption></figure>
        <figure class="photo"><img src="/images/remise-prix.jpg" alt="Remise des prix" loading="lazy" width="1185" height="835"><figcaption><strong>La remise des prix</strong> — les lauréats reçoivent leurs lots devant leurs parents.</figcaption></figure>
        <figure class="photo"><img src="/images/sortie-parc.jpg" alt="Sortie scolaire" loading="lazy" width="1185" height="835"><figcaption><strong>La sortie scolaire</strong> — une journée hors des murs, en fin d'année.</figcaption></figure>
      </div>`,
    }) +
    section({
      claire: true,
      contenu: encart(
        `Inscriptions ${ecole.anneeScolaire}`,
        "Contactez la Direction pour connaître les places disponibles et les pièces à fournir.",
        "/contact.html",
        "Nous joindre"
      ),
    }),
});

// ---- Tarifs ----
let cycleCourant = null;
const lignesTarifs = tarifs
  .map((t) => {
    const nouveau = t.cycle !== cycleCourant;
    cycleCourant = t.cycle;
    const entete = nouveau ? `<tr class="ligne-cycle"><td colspan="5">${e(t.cycle)}</td></tr>` : "";
    return `${entete}<tr>
      <td><strong>${e(t.classe)}</strong></td>
      <td class="nombre">${fr(t.base)}</td>
      <td class="nombre${t.td === null ? " vide" : ""}">${t.td === null ? "—" : fr(t.td)}</td>
      <td class="nombre${t.pt === null ? " vide" : ""}">${t.pt === null ? "—" : fr(t.pt)}</td>
      <td class="nombre">${fr(t.juin)}</td>
    </tr>`;
  })
  .join("");

pages.push({
  fichier: "tarifs.html",
  titre: `Tarifs scolaires ${ecole.anneeScolaire} — École à Brazzaville`,
  description:
    "Tarifs du Complexe Scolaire Professeur Dieu-Veille à Brazzaville : mensualités par " +
    "classe de la Garderie à la 3ème, coût d'une année complète et frais annexes.",
  corps:
    enTete("Les tarifs", "Tous les montants sont en francs CFA, affichés sans exception ni frais caché.") +
    section({
      titre: "Mensualités par classe",
      chapeau:
        "Trois régimes sont possibles au primaire : mi-temps, mi-temps avec travaux dirigés, ou plein temps. Le préscolaire et le collège n'en ont pas tous.",
      contenu: `<div class="tableau-enveloppe"><table>
        <thead><tr><th>Classe</th><th class="nombre">Mi-temps</th><th class="nombre">Mi-temps + T.D.</th><th class="nombre">Plein temps</th><th class="nombre">Forfait de juin</th></tr></thead>
        <tbody>${lignesTarifs}</tbody>
      </table></div>
      <p class="note" style="margin-top:24px">Le tiret signifie que ce régime n'existe pas dans cette classe. Au préscolaire il n'y a pas de travaux dirigés ; au collège, de la 6ème à la 4ème, un tarif unique s'applique, travaux dirigés compris.</p>`,
    }) +
    section({
      claire: true,
      titre: "Ce que coûte une année complète",
      chapeau: "Huit mensualités d'octobre à mai, plus le forfait du mois de juin. Frais annexes non compris.",
      contenu: `<div class="tableau-enveloppe"><table>
        <thead><tr><th>Classe</th><th class="nombre">Mi-temps</th><th class="nombre">Mi-temps + T.D.</th><th class="nombre">Plein temps</th></tr></thead>
        <tbody>${tarifs
          .map(
            (t) => `<tr>
          <td><strong>${e(t.classe)}</strong></td>
          <td class="nombre">${fr(annee(t.base, t.juin))}</td>
          <td class="nombre${t.td === null ? " vide" : ""}">${t.td === null ? "—" : fr(annee(t.td, t.juin))}</td>
          <td class="nombre${t.pt === null ? " vide" : ""}">${t.pt === null ? "—" : fr(annee(t.pt, t.juin))}</td>
        </tr>`
          )
          .join("")}</tbody>
      </table></div>`,
    }) +
    section({
      titre: "Frais annexes",
      contenu: `<div class="tableau-enveloppe"><table>
        <thead><tr><th>Poste</th><th class="nombre">Montant</th><th class="nombre">En euros</th></tr></thead>
        <tbody>${annexes
          .map(
            (a) => `<tr>
          <td><strong>${e(a.poste)}</strong>${a.detail ? `<div style="color:var(--gris);font-size:.87rem">${e(a.detail)}</div>` : ""}</td>
          <td class="nombre">${fr(a.montant)} F</td>
          <td class="nombre" style="color:var(--gris)">${eur(a.montant)} €</td>
        </tr>`
          )
          .join("")}</tbody>
      </table></div>
      <p class="note" style="margin-top:24px">Taux de conversion appliqué : <strong>1 € = ${fr(TAUX_EURO)} FCFA</strong>. Les montants en euros sont indicatifs ; seuls les montants en francs CFA font foi.</p>
      <div style="margin-top:34px"><a class="btn btn-bleu" href="/bourses.html">Aider un enfant à payer sa scolarité</a></div>`,
    }),
});

// ---- Bourses ----
pages.push({
  fichier: "bourses.html",
  titre: "Parrainer un enfant — Bourses scolaires à Brazzaville",
  description:
    "Douze formules de parrainage, de 12,86 € à 271,43 €, pour scolariser un enfant démuni " +
    "à Brazzaville. Chaque versement donne lieu à un reçu numéroté.",
  corps:
    enTete(
      "Offrir une bourse scolaire",
      "Douze formules, de 12,86 € à 271,43 €. Vous choisissez ce que vous financez : une année entière, une demi-année, ou seulement le cartable et les livres."
    ) +
    section({
      claire: true,
      contenu: `<div class="chiffres">
        <div class="chiffre"><div class="valeur">${totalBoursiers}</div><div class="libelle">enfants soutenus aujourd'hui</div></div>
        <div class="chiffre"><div class="valeur">${donateurs.length}</div><div class="libelle">donateurs engagés</div></div>
        <div class="chiffre"><div class="valeur">12,86 €</div><div class="libelle">le premier palier</div></div>
      </div>`,
    }) +
    section({
      titre: "Les douze formules",
      chapeau: "Chaque nom dit ce qu'il couvre. Les deux formules dont le montant est en orange sont les plus demandées.",
      contenu:
        `<div class="grille grille-3 bourses-grille">` +
        bourses
          .map(
            (b) => `<article class="bourse${b.phare ? " phare" : ""}">
          ${b.image ? `<img class="bourse-affiche" src="/images/bourses/${b.image}" alt="Affiche — ${e(b.nom)}" loading="lazy" width="700" height="933" onerror="this.style.display='none'">` : ""}
          <h3>${e(b.nom)}</h3>
          <div class="prix">${fr(b.montant)}${b.montantAlt ? " ou " + fr(b.montantAlt) : ""} F<small>soit ${eur(b.montant)}${b.montantAlt ? " ou " + eur(b.montantAlt) : ""} €</small></div>
          <p>${e(b.texte)}</p>
        </article>`
          )
          .join("") +
        `</div>
        <p class="note" style="margin-top:34px">Taux de conversion appliqué : <strong>1 € = ${fr(TAUX_EURO)} FCFA</strong>. Une année scolaire compte huit mensualités d'octobre à mai, plus le forfait du mois de juin.</p>`,
    }) +
    section({
      claire: true,
      titre: "Trois façons de donner",
      chapeau: "Ces mots se combinent avec n'importe quelle formule : on dit par exemple « une bourse complète, fixe et nominative ».",
      contenu:
        `<div class="grille grille-3">` +
        modalites
          .map(
            (m) => `<article class="carte"><h3>Bourse ${e(m.mot)}</h3><p>${e(m.texte)}</p></article>`
          )
          .join("") +
        `</div>`,
    }) +
    section({
      titre: "Ce que vous recevez en retour",
      contenu: `<div class="grille grille-3">
        <article class="carte"><h3>Une pro-forma nominative</h3><p>Le détail chiffré de ce que vous financez : l'enfant, sa classe, son régime, chaque poste ligne par ligne.</p></article>
        <article class="carte"><h3>Un reçu numéroté</h3><p>Délivré à chaque versement. Aucun mouvement de caisse n'existe sans reçu, ni sans double signature.</p></article>
        <article class="carte"><h3>Un bilan de fin d'année</h3><p>L'usage des fonds est suivi élève par élève et communiqué au donateur à la clôture de l'année scolaire.</p></article>
      </div>`,
    }) +
    section({
      claire: true,
      contenu: encart(
        "Parrainer un enfant",
        "Contactez la Direction pour choisir une formule et recevoir votre pro-forma nominative.",
        "/contact.html",
        "Nous joindre"
      ),
    }),
});

// ---- Donateurs ----
const initiales = (nom) =>
  nom
    .replace(/^(M\.|Madame|Monsieur|Mme)\s+/i, "")
    .split(/[\s,]+/)
    .filter((m) => m.length > 1 && /^[A-ZÀ-Ý]/.test(m))
    .slice(0, 2)
    .map((m) => m[0])
    .join("");

pages.push({
  fichier: "donateurs.html",
  titre: "Nos donateurs — École à Brazzaville",
  description:
    `Sept donateurs soutiennent ${totalBoursiers} enfants au Complexe Scolaire Professeur ` +
    "Dieu-Veille à Brazzaville. Comment l'argent est suivi, franc par franc.",
  corps:
    enTete(
      "Nos donateurs",
      `Grâce à eux, ${totalBoursiers} enfants sont scolarisés cette année sans que leur famille ait à en supporter le coût.`
    ) +
    section({
      titre: "Celles et ceux qui soutiennent l'école",
      chapeau: "Sept personnes, quatorze enfants. Chacun reçoit une pro-forma nominative et un bilan de fin d'année.",
      contenu:
        `<div class="grille grille-3">` +
        donateurs
          .map(
            (d) => `<article class="donateur">
          <div class="pastille">${e(initiales(d.nom))}</div>
          <h3>${e(d.nom)}</h3>
          <p>${d.eleves} ${d.eleves > 1 ? "élèves" : "élève"} — ${e(d.niveaux)}</p>
        </article>`
          )
          .join("") +
        `</div>
        <p class="note" style="margin-top:34px">Cette page nomme les donateurs et le nombre d'enfants qu'ils soutiennent, <strong>jamais les montants versés</strong> ni le nom des enfants concernés. Le détail chiffré reste entre l'école et le donateur ; l'identité des boursiers reste entre l'école et leur famille.</p>`,
    }) +
    section({
      claire: true,
      titre: "Comment l'argent est suivi",
      contenu: `<div class="grille grille-2">
        <article class="carte"><h3>Un seul ordonnateur</h3><p>Aucune dépense n'est engagée sans l'autorisation du Directeur Général. La Direction des Affaires Financières contrôle la caisse, la Gestionnaire encaisse : personne ne va au bout d'une opération seul.</p></article>
        <article class="carte"><h3>Une trace pour chaque franc</h3><p>Chaque encaissement donne lieu à un reçu numéroté. Chaque retrait de caisse est inscrit dans un registre et porte deux signatures. Les fonds d'un boursier sont affectés à son nom.</p></article>
      </div>`,
    }) +
    section({
      contenu: encart(
        "Rejoindre nos donateurs",
        "Douze formules existent, de 12,86 € pour les fêtes de l'année à 271,43 € pour une année complète de Garderie.",
        "/bourses.html",
        "Voir les formules"
      ),
    }),
});

// ---- Galerie ----
pages.push({
  fichier: "galerie.html",
  titre: "L'année en images — École à Brazzaville",
  description:
    "Cérémonie d'émulation, remise des prix, cantine et sortie scolaire au Complexe " +
    "Scolaire Professeur Dieu-Veille, Mfilou, Brazzaville.",
  corps:
    enTete("L'année en images", "Cérémonie d'émulation, remise des prix, cantine et sortie scolaire.") +
    section({
      contenu:
        `<div class="galerie">` +
        galerie
          .map(
            (p) => `<figure class="photo">
          <img src="/images/${p.fichier}" alt="${e(p.legende)}" loading="lazy" width="1185" height="835">
          <figcaption>${e(p.legende)}</figcaption>
        </figure>`
          )
          .join("") +
        `</div>
        <p class="note" style="margin-top:34px">Ces photographies ont été prises lors des activités de l'école. Toute famille qui ne souhaite pas voir son enfant figurer sur ce site peut le faire savoir à la Direction : la photo sera retirée.</p>`,
    }),
});

// ---- Contact ----
pages.push({
  fichier: "contact.html",
  titre: `Nous joindre — ${adresse.rue}, ${adresse.quartier}, ${adresse.ville}`,
  description:
    `Complexe Scolaire Professeur Dieu-Veille, ${adresse.rue}, ${adresse.quartier}, ` +
    `${adresse.ville}. Téléphone et WhatsApp, courriel ${ecole.email}.`,
  corps:
    enTete("Nous joindre", "Pour une inscription, un parrainage, ou toute question sur la scolarité.") +
    section({
      titre: "Qui appeler",
      chapeau: "Chaque numéro correspond à une personne précise. Cliquez pour appeler, ou pour ouvrir WhatsApp.",
      contenu:
        `<div class="grille grille-3">` +
        contacts
          .map(
            (c) => `<article class="carte">
          <div class="classes">${e(c.role)}</div>
          <h3>${c.personne ? e(c.personne) : e(c.numero)}</h3>
          <p>${e(c.note)}</p>
          <p style="margin-top:16px">
            <a class="btn btn-bleu" href="${wa(c)}" target="_blank" rel="noopener">WhatsApp ${e(c.numero)}</a>
          </p>
          <p style="margin-top:10px"><a href="${tel(c)}">Appeler le ${e(c.numero)}</a></p>
        </article>`
          )
          .join("") +
        `</div>`,
    }) +
    section({
      claire: true,
      titre: "Où nous trouver",
      contenu: `<div class="grille grille-2">
        <article class="carte">
          <h3>${e(ecole.nom)}</h3>
          <p>${e(adresse.rue)}<br>${e(adresse.quartier)}<br>${e(adresse.ville)}, ${e(adresse.pays)}</p>
          <p style="margin-top:18px"><a class="btn btn-bleu" href="${adresse.carte}" target="_blank" rel="noopener">Ouvrir dans Google Maps</a></p>
        </article>
        <article class="carte">
          <h3>Par courriel</h3>
          <p>Pour les parrainages, les pro-forma et les pièces administratives.</p>
          <p style="margin-top:18px"><a class="btn btn-bleu" href="mailto:${ecole.email}">${e(ecole.email)}</a></p>
        </article>
      </div>
      <p class="note" style="margin-top:34px">Tout versement à l'école donne lieu à un <strong>reçu numéroté</strong>, remis immédiatement par la Gestionnaire. N'effectuez jamais de paiement sans reçu.</p>`,
    }),
});

// ---------------------------------------------------------------------
//  Écriture
// ---------------------------------------------------------------------
fs.mkdirSync(SORTIE, { recursive: true });

for (const p of pages) {
  fs.writeFileSync(path.join(SORTIE, p.fichier), page(p), "utf8");
  console.log("écrit  " + p.fichier);
}

// Plan du site : la liste que Google lit pour connaître les sept pages.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(
  (p) => `  <url>
    <loc>${ecole.site}${p.lien}</loc>
    <changefreq>monthly</changefreq>
    <priority>${p.lien === "/" ? "1.0" : "0.8"}</priority>
  </url>`
).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(SORTIE, "sitemap.xml"), sitemap, "utf8");
console.log("écrit  sitemap.xml");

fs.writeFileSync(
  path.join(SORTIE, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${ecole.site}/sitemap.xml\n`,
  "utf8"
);
console.log("écrit  robots.txt");

fs.writeFileSync(path.join(SORTIE, "CNAME"), "ecole.kongoscience.com", "utf8");
console.log("écrit  CNAME");

console.log(`\n${pages.length} pages dans ${SORTIE}`);
