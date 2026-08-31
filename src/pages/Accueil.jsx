import { Link } from "react-router-dom";
import { Section, EnTete, img } from "../composants/Mise";
import { ecole, cycles, resultats, galerie, totalBoursiers, donateurs } from "../data/ecole";
import { bourses, fr, eur } from "../data/finances";

export default function Accueil() {
  const phares = bourses.filter((b) => b.phare);

  return (
    <>
      <div className="hero">
        <img className="fond" src={img("banniere.jpg")} alt="" />
        <div className="hero-contenu conteneur">
          <h1>{ecole.nom}</h1>
          <p className="accroche">
            Une école {ecole.devise.toLowerCase()} à {ecole.ville}, où chaque
            enfant est suivi nommément — sa classe, son régime, ce qui est payé.
          </p>
          <div className="boutons">
            <Link className="btn btn-orange" to="/bourses">
              Offrir une bourse
            </Link>
            <Link className="btn btn-contour" to="/tarifs">
              Voir les tarifs
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ chiffres clés */}
      <Section claire>
        <div className="chiffres">
          <div className="chiffre">
            <div className="valeur">3</div>
            <div className="libelle">cycles, de la Garderie à la 3ème</div>
          </div>
          <div className="chiffre">
            <div className="valeur">{totalBoursiers}</div>
            <div className="libelle">enfants boursiers cette année</div>
          </div>
          <div className="chiffre">
            <div className="valeur">{donateurs.length}</div>
            <div className="libelle">donateurs qui les soutiennent</div>
          </div>
          <div className="chiffre">
            <div className="valeur">100 %</div>
            <div className="libelle">de réussite au CEPE</div>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------- les cycles */}
      <Section
        titre="Trois cycles sous un même toit"
        chapeau="L'enfant entre à la Garderie et sort avec son brevet, sans changer d'établissement."
      >
        <div className="grille grille-3">
          {cycles.map((c) => (
            <article className="carte" key={c.nom}>
              <div className="classes">{c.classes}</div>
              <h3>{c.nom}</h3>
              <p>{c.texte}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------- les résultats */}
      <Section
        claire
        titre="Nos résultats aux examens d'État"
        chapeau="Publiés tels que proclamés. Rien n'est ajouté avant la proclamation officielle."
      >
        <div className="tableau-enveloppe">
          <table>
            <thead>
              <tr>
                <th>Année scolaire</th>
                <th className="nombre">CEPE</th>
                <th className="nombre">BEPC</th>
              </tr>
            </thead>
            <tbody>
              {resultats.map((r) => (
                <tr key={r.annee}>
                  <td>{r.annee}</td>
                  <td className="nombre">
                    <strong style={{ color: "var(--orange)" }}>{r.cepe}</strong>
                  </td>
                  <td className="nombre">
                    {r.bepc ? (
                      <strong style={{ color: "var(--orange)" }}>{r.bepc}</strong>
                    ) : (
                      <em style={{ color: "var(--gris)" }}>résultats en cours</em>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---------------------------------------------------- les bourses */}
      <Section
        titre="Parrainer un enfant"
        chapeau="Douze formules, de 12,86 € à 271,43 €. Chaque franc est affecté à un enfant nommé, et chaque versement fait l'objet d'un reçu numéroté."
      >
        <div className="grille grille-2">
          {phares.map((b) => (
            <article className="bourse phare" key={b.nom}>
              <h3>{b.nom}</h3>
              <div className="prix">
                {fr(b.montant)} F
                <small>soit {eur(b.montant)} €</small>
              </div>
              <p>{b.texte}</p>
            </article>
          ))}
        </div>
        <div style={{ marginTop: 22 }}>
          <Link className="btn btn-bleu" to="/bourses">
            Voir les douze formules
          </Link>
        </div>
      </Section>

      {/* ---------------------------------------------------- la galerie */}
      <Section claire titre="L'année en images">
        <div className="galerie">
          {galerie.slice(0, 6).map((p) => (
            <figure className="photo" key={p.fichier} style={{ margin: 0 }}>
              <img src={img(p.fichier)} alt={p.legende} loading="lazy" />
              <figcaption>{p.legende}</figcaption>
            </figure>
          ))}
        </div>
        <div style={{ marginTop: 22 }}>
          <Link className="btn btn-bleu" to="/galerie">
            Toutes les photos
          </Link>
        </div>
      </Section>

      <Section>
        <div className="encart">
          <h2>Inscriptions ouvertes</h2>
          <p>
            Année scolaire {ecole.anneeScolaire}. Contactez la Direction pour
            connaître les places disponibles dans chaque classe.
          </p>
          <Link className="btn btn-orange" to="/contact">
            Nous joindre
          </Link>
        </div>
      </Section>
    </>
  );
}
