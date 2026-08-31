import { Link } from "react-router-dom";
import { Section, EnTete, img } from "../composants/Mise";
import { bourses, modalites, fr, eur, TAUX_EURO } from "../data/finances";
import { totalBoursiers, donateurs } from "../data/ecole";

export default function Bourses() {
  return (
    <>
      <EnTete
        titre="Offrir une bourse scolaire"
        chapeau="Douze formules, de 12,86 € à 271,43 €. Vous choisissez ce que vous financez : une année entière, une demi-année, ou seulement le cartable et les livres."
      />

      <Section claire>
        <div className="chiffres">
          <div className="chiffre">
            <div className="valeur">{totalBoursiers}</div>
            <div className="libelle">enfants soutenus aujourd'hui</div>
          </div>
          <div className="chiffre">
            <div className="valeur">{donateurs.length}</div>
            <div className="libelle">donateurs engagés</div>
          </div>
          <div className="chiffre">
            <div className="valeur">12,86 €</div>
            <div className="libelle">le premier palier</div>
          </div>
        </div>
      </Section>

      <Section
        titre="Les douze formules"
        chapeau="Chaque nom dit ce qu'il couvre. Les deux formules encadrées en bleu sont les plus demandées."
      >
        <div className="grille grille-3">
          {bourses.map((b) => (
            <article className={"bourse" + (b.phare ? " phare" : "")} key={b.nom}>
              {b.image && (
                <img
                  className="bourse-affiche"
                  src={img("bourses/" + b.image)}
                  alt={"Affiche — " + b.nom}
                  loading="lazy"
                />
              )}
              <h3>{b.nom}</h3>
              <div className="prix">
                {fr(b.montant)}
                {b.montantAlt ? ` ou ${fr(b.montantAlt)}` : ""} F
                <small>
                  soit {eur(b.montant)}
                  {b.montantAlt ? ` ou ${eur(b.montantAlt)}` : ""} €
                </small>
              </div>
              <p>{b.texte}</p>
            </article>
          ))}
        </div>

        <p className="note" style={{ marginTop: 22 }}>
          Taux de conversion appliqué : <strong>1 € = {fr(TAUX_EURO)} FCFA</strong>.
          Les montants en euros sont indicatifs ; seuls les montants en francs
          CFA font foi. Une année scolaire compte huit mensualités d'octobre à
          mai, plus le forfait du mois de juin.
        </p>
      </Section>

      <Section
        claire
        titre="Trois façons de donner"
        chapeau="Ces mots se combinent avec n'importe quelle formule : on dit par exemple « une bourse complète, fixe et nominative »."
      >
        <div className="grille grille-3">
          {modalites.map((m) => (
            <article className="carte" key={m.mot}>
              <h3 style={{ textTransform: "capitalize" }}>Bourse {m.mot}</h3>
              <p>{m.texte}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section titre="Ce que vous recevez en retour">
        <div className="grille grille-3">
          <article className="carte">
            <h3>Une pro-forma nominative</h3>
            <p>
              Le détail chiffré de ce que vous financez : l'enfant, sa classe,
              son régime, chaque poste ligne par ligne.
            </p>
          </article>
          <article className="carte">
            <h3>Un reçu numéroté</h3>
            <p>
              Délivré à chaque versement. Aucun mouvement de caisse n'existe
              sans reçu, ni sans double signature.
            </p>
          </article>
          <article className="carte">
            <h3>Un bilan de fin d'année</h3>
            <p>
              L'usage des fonds est suivi élève par élève et communiqué au
              donateur à la clôture de l'année scolaire.
            </p>
          </article>
        </div>
      </Section>

      <Section claire>
        <div className="encart">
          <h2>Parrainer un enfant</h2>
          <p>
            Contactez la Direction pour choisir une formule et recevoir votre
            pro-forma nominative.
          </p>
          <Link className="btn btn-orange" to="/contact">
            Nous joindre
          </Link>
        </div>
      </Section>
    </>
  );
}
