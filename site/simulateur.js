/* =====================================================================
   SIMULATEUR DE FRAIS DE SCOLARITÉ

   Plusieurs enfants, chacun avec SA classe, SON régime et SES options :
   une famille inscrit rarement deux enfants au même niveau.

   RÉDUCTION FAMILIALE — règle de l'école, trois conditions cumulées :
     · au moins TROIS enfants inscrits ;
     · payés EN GROUPE, en une seule fois ;
     · 10 % retirés sur les MENSUALITÉS de chaque enfant, et sur elles
       seules. Sont hors assiette : le forfait du mois de juin,
       l'inscription, la réinscription, l'équipement, les cotisations de
       fêtes et les frais d'examen.
   Jamais pour un boursier : un enfant déjà soutenu par un donateur n'y
   ouvre pas droit et n'entre pas dans le compte des trois.

   Le paiement groupé n'est PAS coché par défaut : le prix affiché à
   l'arrivée est le prix plein, celui qu'on paie effectivement. La
   réduction est une faveur qu'on demande, pas un acquis.

   Les tarifs viennent de window.DONNEES, injecté par construire.js
   depuis donnees/finances.js. Aucun montant n'est écrit ici : un tarif
   ne peut pas diverger entre le tableau et le simulateur.

   jsPDF n'est chargé qu'au clic sur un bouton PDF : inutile d'imposer
   300 ko à qui consulte seulement les tarifs depuis un téléphone.
   ===================================================================== */

(function () {
  "use strict";

  var D = window.DONNEES;
  if (!D) return;

  var $ = function (id) { return document.getElementById(id); };
  var fr = function (n) {
    return Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " ");
  };
  var eur = function (n) {
    return (n / D.taux).toLocaleString("fr-FR", {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  };

  var SEUIL_FRATRIE = 3;   // à partir de trois enfants
  var TAUX_REDUCTION = 0.10;

  var DUREES = {
    annee:     { libelle: "Année complète", mois: 8, juin: true },
    semestre:  { libelle: "Demi-année",     mois: 4, juin: false },
    trimestre: { libelle: "Un trimestre",   mois: 3, juin: false },
    mois:      { libelle: "Un seul mois",   mois: 1, juin: false },
  };

  var LIBELLE_REGIME = {
    base: "Mi-temps",
    td: "Mi-temps avec T.D.",
    pt: "Plein temps",
  };

  // État : un objet par enfant. Le formulaire n'est qu'un reflet de ceci.
  var enfants = [];
  var compteur = 0;

  function tarifDe(classe) {
    for (var i = 0; i < D.tarifs.length; i++) {
      if (D.tarifs[i].classe === classe) return D.tarifs[i];
    }
    return D.tarifs[0];
  }

  // Les régimes réellement disponibles dans une classe. En 6ème il n'y a
  // qu'un tarif ; en CM2, mi-temps et T.D. sont au même prix — les
  // proposer deux fois n'aiderait personne.
  function regimesDe(classe) {
    var t = tarifDe(classe);
    var vus = {}, liste = [];
    ["base", "td", "pt"].forEach(function (cle) {
      var m = t[cle];
      if (m === null || m === 0 || vus[m]) return;
      vus[m] = true;
      liste.push({ cle: cle, montant: m, libelle: LIBELLE_REGIME[cle] });
    });
    return liste;
  }

  function nouvelEnfant() {
    compteur++;
    return {
      id: compteur,
      classe: "CP2",
      regime: "pt",
      nouveau: false,
      fetes: true,
      equipement: true,
      morceaux: false,
      boursier: false,
    };
  }

  // ------------------------------------------------------------------
  //  Formulaire
  // ------------------------------------------------------------------
  function optionsClasses(choisie) {
    var html = "", cycle = null;
    D.tarifs.forEach(function (t) {
      if (t.cycle !== cycle) {
        if (cycle !== null) html += "</optgroup>";
        cycle = t.cycle;
        html += '<optgroup label="' + cycle + '">';
      }
      html += '<option value="' + t.classe + '"' +
              (t.classe === choisie ? " selected" : "") + ">" + t.classe + "</option>";
    });
    return html + "</optgroup>";
  }

  function dessinerEnfants() {
    var zone = $("sim-enfants-liste");
    zone.innerHTML = "";

    enfants.forEach(function (en, i) {
      var regimes = regimesDe(en.classe);
      // Si la classe a changé et que l'ancien régime n'y existe pas, on
      // retombe sur le premier disponible plutôt que de calculer faux.
      if (!regimes.some(function (r) { return r.cle === en.regime; })) {
        en.regime = regimes[0].cle;
      }

      var c = document.createElement("div");
      c.className = "sim-enfant";
      c.innerHTML =
        '<div class="sim-enfant-tete">' +
          "<span>Enfant " + (i + 1) + "</span>" +
          (enfants.length > 1
            ? '<button type="button" class="sim-retirer" data-retirer="' + en.id + '">Retirer</button>'
            : "") +
        "</div>" +

        '<div class="sim-duo">' +
          "<div>" +
            '<label class="sim-libelle" for="cl-' + en.id + '">Classe</label>' +
            '<select class="sim-select" id="cl-' + en.id + '" data-champ="classe" data-id="' + en.id + '">' +
              optionsClasses(en.classe) +
            "</select>" +
          "</div>" +
          "<div>" +
            '<label class="sim-libelle" for="rg-' + en.id + '">Régime</label>' +
            '<select class="sim-select" id="rg-' + en.id + '" data-champ="regime" data-id="' + en.id + '"' +
              (regimes.length === 1 ? " disabled" : "") + ">" +
              regimes.map(function (r) {
                return '<option value="' + r.cle + '"' + (r.cle === en.regime ? " selected" : "") +
                       ">" + r.libelle + " — " + fr(r.montant) + " F/mois</option>";
              }).join("") +
            "</select>" +
          "</div>" +
        "</div>" +

        '<div class="sim-cases">' +
          etiquette(en, "nouveau", "Nouvel élève", "Inscription au lieu de réinscription") +
          etiquette(en, "fetes", "Fêtes", "Les trois cotisations") +
          etiquette(en, "equipement", "Équipement", "Tenue, sac, livres, cahiers") +
          etiquette(en, "morceaux", "Morceaux choisis", "") +
          etiquette(en, "boursier", "Boursier", "Exclu de la réduction familiale") +
        "</div>";
      zone.appendChild(c);
    });

    $("sim-ajouter").style.display = enfants.length >= 8 ? "none" : "";
  }

  function etiquette(en, champ, titre, aide) {
    return '<label class="sim-case' + (en[champ] ? " active" : "") + '">' +
      '<input type="checkbox" data-champ="' + champ + '" data-id="' + en.id + '"' +
      (en[champ] ? " checked" : "") + ">" +
      "<span><strong>" + titre + "</strong>" +
      (aide ? "<small>" + aide + "</small>" : "") + "</span></label>";
  }

  // ------------------------------------------------------------------
  //  Calcul
  // ------------------------------------------------------------------
  function duree() {
    var v = (document.querySelector('input[name="duree"]:checked') || {}).value || "annee";
    return DUREES[v];
  }

  function calculerEnfant(en, d) {
    var t = tarifDe(en.classe);
    var mensuel = t[en.regime];
    if (mensuel === null || mensuel === 0) mensuel = t.base;

    var lignes = [];
    // Deux montants distincts, et c'est important :
    //   · montantScolarite — ce que la famille paie pour la scolarité ;
    //   · mensualites      — l'ASSIETTE de la réduction familiale.
    // Le forfait de juin fait partie de la scolarité mais n'ouvre PAS
    // droit à la remise : seules les mensualités sont remisées.
    var mensualites = d.mois * mensuel;
    var montantScolarite = mensualites + (d.juin ? t.juin : 0);
    lignes.push({
      poste: "Scolarité",
      detail: d.mois + " mensualité" + (d.mois > 1 ? "s" : "") + " de " + fr(mensuel) + " F" +
              (d.juin ? " + forfait de juin " + fr(t.juin) + " F" : ""),
      montant: montantScolarite,
      scolarite: true,
    });

    lignes.push(en.nouveau
      ? { poste: "Inscription", detail: "Nouvel élève", montant: D.annexes.inscription }
      : { poste: "Réinscription", detail: "Ancien élève", montant: D.annexes.reinscription });

    if (en.fetes) lignes.push({ poste: "Cotisations des trois fêtes", detail: "", montant: D.annexes.fetes });
    if (en.equipement) lignes.push({ poste: "Équipement scolaire", detail: "", montant: D.annexes.equipement });
    if (en.morceaux) lignes.push({ poste: "Morceaux choisis", detail: "", montant: D.annexes.morceaux });

    if (D.informatique && D.informatique[en.classe]) {
      lignes.push({ poste: "Frais informatique", detail: "Obligatoire en " + en.classe,
                    montant: D.informatique[en.classe] });
    }
    if (en.classe === "CM2") lignes.push({ poste: "Frais d'examen du CEPE", detail: "Obligatoire en CM2", montant: D.annexes.cepe });
    if (en.classe === "3ème") lignes.push({ poste: "Frais d'examen du BEPC", detail: "Obligatoire en 3ème", montant: D.annexes.bepc });

    var brut = lignes.reduce(function (s, l) { return s + l.montant; }, 0);
    return { enfant: en, lignes: lignes, brut: brut, scolarite: montantScolarite,
             mensualites: mensualites, mensuel: mensuel, classe: en.classe,
             regime: LIBELLE_REGIME[en.regime] };
  }

  function calculer() {
    var d = duree();
    var details = enfants.map(function (en) { return calculerEnfant(en, d); });

    // Seuls les NON-boursiers comptent pour déclencher la réduction, et
    // seuls eux en bénéficient. Le paiement groupé est la seconde
    // condition : trois enfants payés séparément restent au prix plein.
    var payants = details.filter(function (x) { return !x.enfant.boursier; });
    var groupe = $("sim-groupe") ? $("sim-groupe").checked : false;
    var reductionActive = groupe && payants.length >= SEUIL_FRATRIE;

    // L'assiette, ce sont les MENSUALITÉS SEULES. Le forfait de juin,
    // l'inscription, la réinscription, l'équipement, les fêtes et les
    // frais d'examen restent tous en dehors.
    var reduction = 0;
    details.forEach(function (x) {
      // Arrondi au franc DÈS LE CALCUL. Sans cela, un trimestre donne
      // 3 598,5 F de remise : les lignes affichées s'arrondissaient
      // chacune de leur côté et ne faisaient plus la somme du total.
      x.reduction = (reductionActive && !x.enfant.boursier)
        ? Math.round(x.mensualites * TAUX_REDUCTION) : 0;
      x.net = x.brut - x.reduction;
      reduction += x.reduction;
    });

    var brut = details.reduce(function (s, x) { return s + x.brut; }, 0);
    return {
      duree: d, details: details, brut: brut, reduction: reduction,
      total: brut - reduction, reductionActive: reductionActive,
      groupe: groupe,
      nbPayants: payants.length, nbBoursiers: details.length - payants.length,
    };
  }

  // ------------------------------------------------------------------
  //  Affichage
  // ------------------------------------------------------------------
  var dernier = null;

  function afficher() {
    var r = calculer();
    dernier = r;

    $("sim-detail").innerHTML = r.details.map(function (x, i) {
      return '<div class="sim-bloc-enfant">' +
        '<div class="sim-bloc-tete">Enfant ' + (i + 1) + " — " + x.classe +
          '<span>' + fr(x.net) + " F</span></div>" +
        "<table class='sim-table'><tbody>" +
        x.lignes.map(function (l) {
          return "<tr><td>" + l.poste +
            (l.detail ? '<div class="sim-sous">' + l.detail + "</div>" : "") +
            '</td><td class="nombre">' + fr(l.montant) + " F</td></tr>";
        }).join("") +
        (x.reduction
          ? '<tr class="sim-remise"><td>Réduction familiale, 10 % des mensualités</td><td class="nombre">− ' +
            fr(x.reduction) + " F</td></tr>"
          : "") +
        (x.enfant.boursier
          ? '<tr><td colspan="2"><div class="sim-sous">Boursier : pas de réduction familiale</div></td></tr>'
          : "") +
        "</tbody></table></div>";
    }).join("");

    $("sim-total").textContent = fr(r.total) + " F";
    $("sim-total-eur").textContent = eur(r.total) + " €";

    var zoneRed = $("sim-reduction");
    if (r.reduction > 0) {
      zoneRed.style.display = "";
      $("sim-reduction-montant").textContent = "− " + fr(r.reduction) + " F";
    } else {
      zoneRed.style.display = "none";
    }

    // La note n'apparaît que quand elle sert : dès deux enfants, ou dès
    // qu'un boursier est coché. Son texte dit ce qui manque encore pour
    // obtenir la réduction, plutôt que de répéter la règle en bloc.
    var note = $("sim-note-fratrie");
    if (enfants.length > 1 || r.nbBoursiers > 0) {
      note.style.display = "";
      if (r.reductionActive) {
        note.innerHTML = "Réduction accordée : <strong>" + r.nbPayants +
          " enfants payants</strong>, réglés en une seule fois." +
          (r.nbBoursiers ? " Les boursiers en sont exclus." : "");
      } else if (r.nbPayants < SEUIL_FRATRIE) {
        note.innerHTML = "Il faut <strong>au moins trois enfants payants</strong> " +
          "pour la réduction familiale. Vous en avez " + r.nbPayants + "." +
          (r.nbBoursiers ? " Les boursiers ne comptent pas." : "");
      } else {
        note.innerHTML = "Cochez <strong>« nous payons en une seule fois »</strong> " +
          "pour obtenir les 10 % : c'est le paiement groupé qui y donne droit.";
      }
    } else {
      note.style.display = "none";
    }
  }

  // ------------------------------------------------------------------
  //  Résumé texte — envoyé par WhatsApp ou SMS
  // ------------------------------------------------------------------
  function resume() {
    var r = dernier || calculer();
    var l = ["SIMULATION — " + D.ecole.nom, "", "Durée : " + r.duree.libelle, ""];
    r.details.forEach(function (x, i) {
      l.push("Enfant " + (i + 1) + " — " + x.classe + " (" + x.regime + ")" +
             (x.enfant.boursier ? " [boursier]" : "") + " : " + fr(x.net) + " F");
    });
    l.push("");
    if (r.reduction > 0) {
      l.push("Sous-total : " + fr(r.brut) + " F");
      l.push("Reduction familiale 10 % des mensualites, par enfant : - " + fr(r.reduction) + " F");
    }
    l.push("TOTAL : " + fr(r.total) + " F  (" + eur(r.total) + " EUR)");
    l.push("");
    l.push("Estimation à confirmer auprès de la Direction.");
    l.push(D.ecole.site + "/tarifs.html");
    return l.join("\n");
  }

  // ------------------------------------------------------------------
  //  PDF
  // ------------------------------------------------------------------
  function chargerJsPDF() {
    if (window.jspdf) return Promise.resolve(window.jspdf);
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js";
      s.onload = function () { resolve(window.jspdf); };
      s.onerror = function () { reject(new Error("jsPDF injoignable")); };
      document.head.appendChild(s);
    });
  }

  // Le logo est réduit puis gardé en mémoire : on ne le retélécharge et
  // on ne le recalcule pas à chaque PDF.
  var logoMemoire = null;

  // Le sceau fait 1218 x 1251. Embarqué tel quel, il produisait un PDF
  // de 5,9 Mo — impossible à envoyer par WhatsApp depuis Brazzaville.
  // Réduit à 260 px et aplati sur blanc en JPEG, il pèse quelques
  // dizaines de kilo-octets et reste net à 20 mm sur la page.
  var LOGO_PX = 260;

  function chargerLogo() {
    if (logoMemoire !== null) return Promise.resolve(logoMemoire);
    return new Promise(function (resoudre) {
      var img = new Image();
      img.onload = function () {
        try {
          var c = document.createElement("canvas");
          c.width = LOGO_PX;
          c.height = Math.round(LOGO_PX * img.height / img.width);
          var ctx = c.getContext("2d");
          // Le PNG est transparent : sans fond blanc, le JPEG sortirait noir.
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          logoMemoire = { donnees: c.toDataURL("image/jpeg", 0.92),
                          ratio: c.height / c.width };
        } catch (e) {
          logoMemoire = false;
        }
        resoudre(logoMemoire);
      };
      // Un logo manquant ne doit pas empêcher d'obtenir son devis.
      img.onerror = function () { logoMemoire = false; resoudre(false); };
      img.src = "/images/logo.png";
    });
  }

  function construirePdf(jspdf, logo) {
    var r = dernier || calculer();
    var doc = new jspdf.jsPDF({ unit: "mm", format: "a4" });
    var L = 18, l = 174, y = 20;

    var saut = function (h) {
      if (y + h > 275) { doc.addPage(); y = 22; }
    };

    if (logo && logo.donnees) {
      doc.addImage(logo.donnees, "JPEG", L, y - 6, 20, 20 * logo.ratio);
    }

    doc.setFont("helvetica", "bold"); doc.setFontSize(15);
    doc.text(D.ecole.nom.toUpperCase(), 105, y, { align: "center" }); y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text(D.ecole.adresse, 105, y, { align: "center" }); y += 4.5;
    doc.text(D.ecole.telephones, 105, y, { align: "center" }); y += 12;

    doc.setFillColor(0, 89, 154);
    doc.rect(L, y - 6, l, 11, "F");
    doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text("PRO-FORMA — SIMULATION DES FRAIS DE SCOLARITÉ", 105, y + 1.5, { align: "center" });
    doc.setTextColor(0); y += 16;

    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text("Durée : " + r.duree.libelle, L, y);
    doc.text(r.details.length + " enfant" + (r.details.length > 1 ? "s" : ""), L + l, y, { align: "right" });
    y += 6;

    r.details.forEach(function (x, i) {
      saut(14 + x.lignes.length * 7);
      doc.setDrawColor(190); doc.line(L, y, L + l, y); y += 7;
      doc.setFont("helvetica", "bold"); doc.setFontSize(10);
      doc.text("Enfant " + (i + 1) + " — " + x.classe + " · " + x.regime +
               (x.enfant.boursier ? "  (boursier)" : ""), L, y);
      doc.text(fr(x.net) + " F", L + l, y, { align: "right" });
      y += 7;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9);
      x.lignes.forEach(function (li) {
        saut(6);
        doc.text(li.poste, L + 4, y);
        doc.text(fr(li.montant) + " F", L + l, y, { align: "right" });
        y += 5.5;
      });
      if (x.reduction) {
        saut(6);
        doc.text("Réduction familiale, 10 % des mensualités", L + 4, y);
        doc.text("- " + fr(x.reduction) + " F", L + l, y, { align: "right" });
        y += 5.5;
      }
      y += 3;
    });

    saut(30);
    if (r.reduction > 0) {
      doc.setFontSize(10);
      doc.text("Sous-total", L, y);
      doc.text(fr(r.brut) + " F", L + l, y, { align: "right" }); y += 6;
      doc.text("Réduction familiale — 10 % des mensualités de chaque enfant", L, y);
      doc.text("- " + fr(r.reduction) + " F", L + l, y, { align: "right" }); y += 8;
    }

    doc.setFillColor(0, 62, 108);
    doc.rect(L, y - 6, l, 14, "F");
    doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(13);
    doc.text("TOTAL", L + 4, y + 3);
    doc.text(fr(r.total) + " F CFA", L + l - 4, y + 3, { align: "right" });
    doc.setTextColor(0); y += 16;

    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text("Soit environ " + eur(r.total) + " € au taux de 1 € = " + fr(D.taux) + " FCFA.", L, y);
    y += 10;

    doc.setFontSize(8); doc.setTextColor(110);
    var texte = "Ce document est une SIMULATION produite automatiquement à partir des tarifs " +
      "en vigueur. Il ne constitue pas une facture et n'engage pas l'école. " +
      "La réduction familiale de 10 % suppose trois conditions réunies : au moins trois " +
      "enfants payants, un règlement en une seule fois, et des enfants non boursiers. " +
      "Elle porte sur les MENSUALITÉS seules : le forfait du mois de juin, " +
      "l'inscription, la réinscription, l'équipement, les cotisations de fêtes et " +
      "les frais d'examen restent tous hors assiette. Les montants sont à confirmer auprès de la " +
      "Direction, qui délivre seule les pro-forma officielles. Tout versement donne " +
      "lieu à un reçu numéroté.";
    var avert = doc.splitTextToSize(texte, l);
    saut(avert.length * 4 + 14);
    doc.text(avert, L, y);
    y += avert.length * 4 + 8;

    doc.setTextColor(0); doc.setFontSize(9);
    doc.text("Établi le " + new Date().toLocaleDateString("fr-FR"), L, y);
    doc.text(D.ecole.site, L + l, y, { align: "right" });
    return doc;
  }

  function nomFichier() {
    return "simulation-scolarite-" + new Date().toISOString().slice(0, 10) + ".pdf";
  }

  function dire(msg, ok) {
    var z = $("sim-message");
    z.textContent = msg;
    z.className = "sim-message" + (ok ? " ok" : "");
    z.style.display = "block";
  }

  function partager() {
    dire("Préparation du PDF…", true);
    Promise.all([chargerJsPDF(), chargerLogo()]).then(function (res) {
      var jspdf = res[0], logo = res[1];
      var doc = construirePdf(jspdf, logo);
      var blob = doc.output("blob");
      var fichier = new File([blob], nomFichier(), { type: "application/pdf" });
      if (navigator.canShare && navigator.canShare({ files: [fichier] })) {
        navigator.share({ files: [fichier], title: "Simulation des frais de scolarité", text: resume() })
          .then(function () { dire("Partagé.", true); })
          .catch(function () { dire("Partage annulé.", true); });
      } else {
        doc.save(nomFichier());
        dire("PDF enregistré. Votre appareil ne permet pas l'envoi direct : joignez le " +
             "fichier depuis WhatsApp, ou utilisez « Envoyer le résumé ».", true);
      }
    }).catch(function () {
      dire("Le générateur de PDF n'a pas pu être chargé. Utilisez « Envoyer le résumé », " +
           "qui fonctionne sans PDF.", false);
    });
  }

  function telecharger() {
    dire("Préparation du PDF…", true);
    Promise.all([chargerJsPDF(), chargerLogo()]).then(function (res) {
      construirePdf(res[0], res[1]).save(nomFichier());
      dire("PDF enregistré dans vos téléchargements.", true);
    }).catch(function () {
      dire("Le générateur de PDF n'a pas pu être chargé. Vérifiez votre connexion.", false);
    });
  }

  function envoyerResume() {
    window.open("https://wa.me/" + D.ecole.whatsapp + "?text=" +
                encodeURIComponent(resume()), "_blank", "noopener");
  }

  // ------------------------------------------------------------------
  //  Démarrage
  // ------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    if (!$("sim-enfants-liste")) return;

    enfants.push(nouvelEnfant());
    dessinerEnfants();
    afficher();

    $("sim-ajouter").addEventListener("click", function () {
      enfants.push(nouvelEnfant());
      dessinerEnfants();
      afficher();
    });

    // Un seul écouteur sur la liste : les cartes sont redessinées à
    // chaque changement, des écouteurs individuels seraient perdus.
    $("sim-enfants-liste").addEventListener("change", function (ev) {
      var el = ev.target;
      var id = parseInt(el.getAttribute("data-id"), 10);
      var champ = el.getAttribute("data-champ");
      if (!id || !champ) return;
      var en = enfants.filter(function (x) { return x.id === id; })[0];
      if (!en) return;
      en[champ] = el.type === "checkbox" ? el.checked : el.value;
      dessinerEnfants();
      afficher();
    });

    $("sim-enfants-liste").addEventListener("click", function (ev) {
      var id = ev.target.getAttribute && ev.target.getAttribute("data-retirer");
      if (!id) return;
      enfants = enfants.filter(function (x) { return x.id !== parseInt(id, 10); });
      dessinerEnfants();
      afficher();
    });

    document.querySelectorAll('input[name="duree"]').forEach(function (el) {
      el.addEventListener("change", afficher);
    });
    if ($("sim-groupe")) $("sim-groupe").addEventListener("change", afficher);

    $("sim-pdf").addEventListener("click", partager);
    $("sim-telecharger").addEventListener("click", telecharger);
    $("sim-whatsapp").addEventListener("click", envoyerResume);

    if (!(navigator.canShare && navigator.canShare({
      files: [new File([new Blob(["x"])], "t.pdf", { type: "application/pdf" })]
    }))) {
      $("sim-pdf").textContent = "Générer le PDF";
    }
  });
})();
