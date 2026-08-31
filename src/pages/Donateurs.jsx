import { Link } from "react-router-dom";
import { Section, EnTete } from "../composants/Mise";
import { donateurs, totalBoursiers } from "../data/ecole";

// Initiales pour la pastille : « Madame Imen Arfaoui » -> « IA ».
const initiales = (nom) =>
  nom
    .replace(/^(M\.|Madame|Monsieur|Mme|Mr)\s+/i, "")
    .split(/[\s,]+/)
    .filter((m) => m.length > 1 && /^[A-ZÀ-Ý]/.test(m))
    .slice(0, 2)
    .map((m) => m[0])
    .join("");

export default function Donateurs() {
  return (
    <>
      <EnTete
        titre="Nos donateurs"
        chapeau={`Grâce à eux, ${totalBoursiers} enfants sont scolarisés cette année sans que leur famille ait à en supporter le coût.`}
      />

      <Section
        titre="Celles et ceux qui soutiennent l'école"
        chapeau="Sept personnes, quatorze enfants. Chacun reçoit une pro-forma nominative et un bilan de fin d'année."
      >
        <div className="grille grille-3">
          {donateurs.map((d) => (
            <article className="donateur" key={d.nom}>
              <div className="pastille">{initiales(d.nom)}</div>
              <h3>{d.nom}</h3>
              <p>
                {d.eleves} {d.eleves > 1 ? "élèves" : "élève"} — {d.niveaux}
              </p>
            </article>
          ))}
        </div>

        <p className="note" style={{ marginTop: 24 }}>
          Cette page nomme les donateurs et le nombre d'enfants qu'ils
          soutiennent, <strong>jamais les montants versés</strong> ni le nom des
          enfants concernés. Le détail chiffré reste entre l'école et le
          donateur ; l'identité des boursiers reste entre l'école et leur
          famille.
        </p>
      </Section>

      <Section claire titre="Comment l'argent est suivi">
        <div className="grille grille-2">
          <article className="carte">
            <h3>Un seul ordonnateur</h3>
            <p>
              Aucune dépense n'est engagée sans l'autorisation du Directeur
              Général. La Direction des Affaires Financières contrôle la caisse,
              la Gestionnaire encaisse : personne ne va au bout d'une opération
              seul.
            </p>
          </article>
          <article className="carte">
            <h3>Une trace pour chaque franc</h3>
            <p>
              Chaque encaissement donne lieu à un reçu numéroté. Chaque retrait
              de caisse est inscrit dans un registre et porte deux signatures.
              Les fonds d'un boursier sont affectés à son nom.
            </p>
          </article>
        </div>
      </Section>

      <Section>
        <div className="encart">
          <h2>Rejoindre nos donateurs</h2>
          <p>
            Douze formules existent, de 12,86 € pour les fêtes de l'année à
            271,43 € pour une année complète de Garderie.
          </p>
          <Link className="btn btn-orange" to="/bourses">
            Voir les formules
          </Link>
        </div>
      </Section>
    </>
  );
}
