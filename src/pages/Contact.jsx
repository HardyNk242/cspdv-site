import { Section, EnTete } from "../composants/Mise";
import { ecole } from "../data/ecole";

export default function Contact() {
  return (
    <>
      <EnTete
        titre="Nous joindre"
        chapeau="Pour une inscription, un parrainage, ou toute question sur la scolarité."
      />

      <Section titre="Par téléphone">
        <div className="grille grille-3">
          {ecole.telephones.map((t) => (
            <a
              className="carte"
              key={t}
              href={"tel:+242" + t.replace(/\s/g, "")}
              style={{ textDecoration: "none", display: "block" }}
            >
              <h3 style={{ marginBottom: 4 }}>{t}</h3>
              <p>Direction du Complexe Scolaire</p>
            </a>
          ))}
        </div>
      </Section>

      <Section claire titre="Où nous trouver">
        <div className="grille grille-2">
          <article className="carte">
            <h3>{ecole.nom}</h3>
            <p>
              {ecole.ville}, {ecole.pays}
              <br />
              {ecole.devise}
            </p>
          </article>
          <article className="carte">
            <h3>Année scolaire {ecole.anneeScolaire}</h3>
            <p>
              Les inscriptions sont ouvertes. La Direction vous indiquera les
              places disponibles par classe et les pièces à fournir.
            </p>
          </article>
        </div>

        <p className="note" style={{ marginTop: 24 }}>
          Tout versement à l'école donne lieu à un <strong>reçu numéroté</strong>,
          remis immédiatement par la Gestionnaire. N'effectuez jamais de paiement
          sans reçu.
        </p>
      </Section>
    </>
  );
}
