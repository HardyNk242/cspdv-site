/* =====================================================================
   SIMULATEUR DE FRAIS DE SCOLARITÉ

   1 728 combinaisons par enfant — 27 couples classe x régime, deux
   types de dossier, trois options, quatre durées. Près de trois
   millions pour une fratrie de deux. Aucun tableau ne couvre cela :
   d'où un simulateur plutôt qu'une grille de plus.

   Les tarifs viennent de window.DONNEES, injecté par construire.js
   depuis donnees/finances.js. Il n'y a donc AUCUN montant écrit ici :
   un tarif ne peut pas diverger entre le tableau et le simulateur.

   jsPDF n'est chargé qu'au clic sur « Générer le PDF » : inutile
   d'imposer 300 ko à qui consulte seulement les tarifs depuis un
   téléphone en 3G.
   ===================================================================== */

(function () {
  "use strict";

  var D = window.DONNEES;
  if (!D) return;

  var $ = function (id) { return document.getElementById(id); };
  var fr = function (n) {
    return Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " ");
  };
  var eur = function (n) {
    return (n / D.taux).toLocaleString("fr-FR", {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    });
  };

  var DUREES = [
    { cle: "annee",    libelle: "Année complète",  mois: 8, juin: true },
    { cle: "semestre", libelle: "Demi-année",      mois: 4, juin: false },
    { cle: "trimestre", libelle: "Un trimestre",   mois: 3, juin: false },
    { cle: "mois",     libelle: "Un seul mois",    mois: 1, juin: false },
  ];

  var REGIMES = [
    { cle: "base", libelle: "Mi-temps", detail: "Une demi-journée de classe" },
    { cle: "td",   libelle: "Mi-temps avec travaux dirigés", detail: "La demi-journée, plus l'accompagnement" },
    { cle: "pt",   libelle: "Plein temps", detail: "La journée entière" },
  ];

  // ------------------------------------------------------------------
  //  Construction du formulaire
  // ------------------------------------------------------------------
  function remplirClasses() {
    var sel = $("sim-classe");
    var cycleCourant = null, groupe = null;
    D.tarifs.forEach(function (t) {
      if (t.cycle !== cycleCourant) {
        cycleCourant = t.cycle;
        groupe = document.createElement("optgroup");
        groupe.label = t.cycle;
        sel.appendChild(groupe);
      }
      var o = document.createElement("option");
      o.value = t.classe;
      o.textContent = t.classe;
      groupe.appendChild(o);
    });
    sel.value = "CP2";
  }

  function classeChoisie() {
    var v = $("sim-classe").value;
    return D.tarifs.filter(function (t) { return t.classe === v; })[0];
  }

  // Les régimes proposés dépendent de la classe : proposer « plein temps »
  // en 6ème, où il n'existe pas, produirait un devis faux.
  function majRegimes() {
    var t = classeChoisie();
    var zone = $("sim-regimes");
    var ancien = (document.querySelector('input[name="regime"]:checked') || {}).value;
    zone.innerHTML = "";

    var vus = {};
    REGIMES.forEach(function (r) {
      var montant = t[r.cle];
      if (montant === null || montant === 0) return;
      if (vus[montant]) return;          // en CM2, mi-temps et T.D. sont au même prix
      vus[montant] = true;

      var id = "reg-" + r.cle;
      var l = document.createElement("label");
      l.className = "sim-choix";
      l.innerHTML =
        '<input type="radio" name="regime" id="' + id + '" value="' + r.cle + '">' +
        '<span class="sim-choix-texte"><strong>' + r.libelle + "</strong>" +
        '<small>' + r.detail + " — " + fr(montant) + " F par mois</small></span>";
      zone.appendChild(l);
    });

    var dispo = zone.querySelectorAll('input[name="regime"]');
    if (!dispo.length) return;
    var cible = zone.querySelector('input[value="' + ancien + '"]') || dispo[0];
    cible.checked = true;
  }

  // ------------------------------------------------------------------
  //  Le calcul
  // ------------------------------------------------------------------
  function calculer() {
    var t = classeChoisie();
    var regime = (document.querySelector('input[name="regime"]:checked') || {}).value || "base";
    var duree = DUREES.filter(function (d) {
      return d.cle === (document.querySelector('input[name="duree"]:checked') || {}).value;
    })[0] || DUREES[0];
    var enfants = parseInt($("sim-enfants").value, 10) || 1;

    var mensuel = t[regime];
    if (mensuel === null || mensuel === 0) mensuel = t.base;

    var lignes = [];

    var scolarite = duree.mois * mensuel + (duree.juin ? t.juin : 0);
    lignes.push({
      poste: "Scolarité — " + t.classe + ", " + duree.libelle.toLowerCase(),
      detail: duree.mois + " mensualité" + (duree.mois > 1 ? "s" : "") + " de " + fr(mensuel) + " F" +
              (duree.juin ? " + forfait de juin " + fr(t.juin) + " F" : ""),
      montant: scolarite,
    });

    if ($("sim-nouveau").checked) {
      lignes.push({ poste: "Inscription", detail: "Nouvel élève", montant: D.annexes.inscription });
    } else {
      lignes.push({ poste: "Réinscription", detail: "Ancien élève", montant: D.annexes.reinscription });
    }

    if ($("sim-fetes").checked) {
      lignes.push({
        poste: "Cotisations des trois fêtes",
        detail: "Noël, fête de l'école, sortie scolaire",
        montant: D.annexes.fetes,
      });
    }
    if ($("sim-equipement").checked) {
      lignes.push({
        poste: "Équipement scolaire",
        detail: "Tenue, sac à dos, livres, cahiers",
        montant: D.annexes.equipement,
      });
    }
    if ($("sim-morceaux").checked) {
      lignes.push({ poste: "Morceaux choisis", detail: "", montant: D.annexes.morceaux });
    }

    // Frais imposés par la classe : ni cochés ni décochés, ils s'appliquent.
    // La table informatique est vide tant que la salle n'existe pas ; ce
    // bloc ne produit donc rien aujourd'hui, et reste prêt pour le jour où.
    if (D.informatique && D.informatique[t.classe]) {
      lignes.push({
        poste: "Frais informatique",
        detail: "Obligatoire en " + t.classe,
        montant: D.informatique[t.classe],
      });
    }
    if (t.classe === "CM2") {
      lignes.push({ poste: "Frais d'examen du CEPE", detail: "Obligatoire en CM2", montant: D.annexes.cepe });
    }
    if (t.classe === "3ème") {
      lignes.push({ poste: "Frais d'examen du BEPC", detail: "Obligatoire en 3ème", montant: D.annexes.bepc });
    }

    var parEnfant = lignes.reduce(function (s, l) { return s + l.montant; }, 0);
    return {
      lignes: lignes, parEnfant: parEnfant, enfants: enfants,
      total: parEnfant * enfants,
      classe: t.classe, regime: regime, duree: duree,
      mensualite: mensuel,
    };
  }

  // ------------------------------------------------------------------
  //  Affichage
  // ------------------------------------------------------------------
  var dernier = null;

  function afficher() {
    var r = calculer();
    dernier = r;

    $("sim-detail").innerHTML = r.lignes.map(function (l) {
      return '<tr><td><strong>' + l.poste + "</strong>" +
        (l.detail ? '<div class="sim-sous">' + l.detail + "</div>" : "") +
        '</td><td class="nombre">' + fr(l.montant) + " F</td></tr>";
    }).join("");

    $("sim-par-enfant").textContent = fr(r.parEnfant) + " F";
    $("sim-total").textContent = fr(r.total) + " F";
    $("sim-total-eur").textContent = eur(r.total) + " €";
    $("sim-mensuel").textContent = fr(r.mensualite) + " F";

    $("sim-ligne-fratrie").style.display = r.enfants > 1 ? "" : "none";
    $("sim-nb-enfants").textContent = r.enfants;
    $("sim-note-fratrie").style.display = r.enfants > 1 ? "" : "none";
  }

  // ------------------------------------------------------------------
  //  Le résumé texte — c'est lui qu'on envoie par WhatsApp ou SMS
  // ------------------------------------------------------------------
  function resume() {
    var r = dernier || calculer();
    var l = ["SIMULATION — " + D.ecole.nom, ""];
    l.push("Classe : " + r.classe);
    l.push("Durée : " + r.duree.libelle);
    l.push("Enfants : " + r.enfants);
    l.push("");
    r.lignes.forEach(function (x) { l.push("- " + x.poste + " : " + fr(x.montant) + " F"); });
    l.push("");
    if (r.enfants > 1) l.push("Par enfant : " + fr(r.parEnfant) + " F");
    l.push("TOTAL : " + fr(r.total) + " F  (" + eur(r.total) + " EUR)");
    l.push("");
    l.push("Estimation à confirmer auprès de la Direction.");
    l.push(D.ecole.site + "/tarifs.html");
    return l.join("\n");
  }

  // ------------------------------------------------------------------
  //  PDF — jsPDF chargé seulement maintenant
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

  function construirePdf(jspdf) {
    var r = dernier || calculer();
    var doc = new jspdf.jsPDF({ unit: "mm", format: "a4" });
    var L = 18, y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(D.ecole.nom.toUpperCase(), 105, y, { align: "center" });
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(D.ecole.adresse, 105, y, { align: "center" });
    y += 4.5;
    doc.text(D.ecole.telephones, 105, y, { align: "center" });

    y += 12;
    doc.setFillColor(0, 89, 154);
    doc.rect(L, y - 6, 174, 11, "F");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PRO-FORMA — SIMULATION DES FRAIS DE SCOLARITÉ", 105, y + 1.5, { align: "center" });
    doc.setTextColor(0);

    y += 16;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Classe : " + r.classe, L, y);
    doc.text("Durée : " + r.duree.libelle, L + 60, y);
    doc.text("Enfant(s) : " + r.enfants, L + 130, y);
    y += 4;
    doc.setDrawColor(200);
    doc.line(L, y, L + 174, y);

    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("POSTE", L, y);
    doc.text("MONTANT", L + 174, y, { align: "right" });
    y += 2;
    doc.line(L, y, L + 174, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    r.lignes.forEach(function (l) {
      doc.text(l.poste, L, y);
      doc.text(fr(l.montant) + " F", L + 174, y, { align: "right" });
      if (l.detail) {
        y += 4;
        doc.setFontSize(8);
        doc.setTextColor(110);
        doc.text(l.detail, L, y);
        doc.setTextColor(0);
        doc.setFontSize(10);
      }
      y += 7;
    });

    doc.line(L, y - 3, L + 174, y - 3);
    y += 3;

    if (r.enfants > 1) {
      doc.text("Par enfant", L, y);
      doc.text(fr(r.parEnfant) + " F", L + 174, y, { align: "right" });
      y += 6;
      doc.text("Nombre d'enfants", L, y);
      doc.text("x " + r.enfants, L + 174, y, { align: "right" });
      y += 8;
    }

    doc.setFillColor(0, 62, 108);
    doc.rect(L, y - 6, 174, 14, "F");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("TOTAL", L + 4, y + 3);
    doc.text(fr(r.total) + " F CFA", L + 170, y + 3, { align: "right" });
    doc.setTextColor(0);

    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Soit environ " + eur(r.total) + " € au taux de 1 € = " + fr(D.taux) + " FCFA.", L, y);

    y += 12;
    doc.setFontSize(8);
    doc.setTextColor(110);
    var avert = doc.splitTextToSize(
      "Ce document est une SIMULATION produite automatiquement à partir des tarifs en " +
      "vigueur. Il ne constitue pas une facture et n'engage pas l'école. Les montants " +
      "sont à confirmer auprès de la Direction, qui délivre seule les pro-forma " +
      "officielles. Tout versement donne lieu à un reçu numéroté.", 174);
    doc.text(avert, L, y);

    y += avert.length * 4 + 8;
    doc.setTextColor(0);
    doc.setFontSize(9);
    doc.text("Établi le " + new Date().toLocaleDateString("fr-FR"), L, y);
    doc.text(D.ecole.site, L + 174, y, { align: "right" });

    return doc;
  }

  function nomFichier() {
    var r = dernier || calculer();
    return "simulation-" + r.classe.replace(/[^a-zA-Z0-9]/g, "") + "-" +
           new Date().toISOString().slice(0, 10) + ".pdf";
  }

  function dire(msg, ok) {
    var z = $("sim-message");
    z.textContent = msg;
    z.className = "sim-message" + (ok ? " ok" : "");
    z.style.display = "block";
  }

  // Partage : on tente d'abord le partage natif AVEC le fichier, seul
  // moyen d'envoyer le PDF lui-même dans WhatsApp. Sinon on télécharge.
  function partager() {
    dire("Préparation du PDF…", true);
    chargerJsPDF().then(function (jspdf) {
      var doc = construirePdf(jspdf);
      var blob = doc.output("blob");
      var fichier = new File([blob], nomFichier(), { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [fichier] })) {
        navigator.share({
          files: [fichier],
          title: "Simulation des frais de scolarité",
          text: resume(),
        }).then(function () {
          dire("Partagé.", true);
        }).catch(function () {
          dire("Partage annulé.", true);
        });
      } else {
        doc.save(nomFichier());
        dire("PDF enregistré. Votre appareil ne permet pas l'envoi direct : " +
             "joignez le fichier depuis WhatsApp, ou utilisez le bouton « Envoyer le résumé ».", true);
      }
    }).catch(function () {
      dire("Le générateur de PDF n'a pas pu être chargé. Vérifiez votre connexion, " +
           "ou utilisez le bouton « Envoyer le résumé », qui fonctionne sans PDF.", false);
    });
  }

  function telecharger() {
    dire("Préparation du PDF…", true);
    chargerJsPDF().then(function (jspdf) {
      construirePdf(jspdf).save(nomFichier());
      dire("PDF enregistré dans vos téléchargements.", true);
    }).catch(function () {
      dire("Le générateur de PDF n'a pas pu être chargé. Vérifiez votre connexion.", false);
    });
  }

  // Le résumé texte marche partout, même sans PDF et en connexion faible.
  function envoyerResume() {
    window.open("https://wa.me/" + D.ecole.whatsapp + "?text=" +
                encodeURIComponent(resume()), "_blank", "noopener");
  }

  // ------------------------------------------------------------------
  //  Démarrage
  // ------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    if (!$("sim-classe")) return;

    remplirClasses();
    majRegimes();
    afficher();

    $("sim-classe").addEventListener("change", function () {
      majRegimes();
      afficher();
    });
    document.querySelectorAll("#simulateur input, #simulateur select").forEach(function (el) {
      el.addEventListener("change", afficher);
    });
    $("sim-regimes").addEventListener("change", afficher);

    $("sim-pdf").addEventListener("click", partager);
    $("sim-telecharger").addEventListener("click", telecharger);
    $("sim-whatsapp").addEventListener("click", envoyerResume);

    // Sur téléphone, le partage natif porte le PDF ; ailleurs il n'existe
    // pas. On adapte le libellé plutôt que de promettre l'impossible.
    if (!(navigator.canShare && navigator.canShare({
      files: [new File([new Blob(["x"])], "t.pdf", { type: "application/pdf" })]
    }))) {
      $("sim-pdf").textContent = "Générer le PDF";
    }
  });
})();
