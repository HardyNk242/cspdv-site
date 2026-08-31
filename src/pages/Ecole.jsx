import { Link } from "react-router-dom";
import { Section, EnTete, img } from "../composants/Mise";
import { cycles, ecole } from "../data/ecole";

export default function Ecole() {
  return (
    <>
      <EnTete
        titre="L'école"
        chapeau={`${ecole.devise} — un enfant entre à la Garderie et sort avec son brevet, sans changer d'établissement.`}
      />

      <Section titre="Les trois cycles">
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

      <Section
        claire
        titre="Les régimes de scolarité"
        chapeau="Au primaire, la famille choisit selon ses moyens et selon l'enfant."
      >
        <div className="grille grille-3">
          <article className="carte">
            <h3>Mi-temps</h3>
            <p>
              Une demi-journée de classe. C'est le régime le plus accessible ;
              l'enfant suit le même programme, sur une demi-journée.
            </p>
          </article>
          <article className="carte">
            <h3>Mi-temps avec travaux dirigés</h3>
            <p>
              La demi-journée de classe, plus des séances d'accompagnement.
              Utile aux élèves qui ont besoin d'être repris.
            </p>
          </article>
          <article className="carte">
            <h3>Plein temps</h3>
            <p>
              La journée entière à l'école, travaux dirigés compris. Au collège,
              ce régime n'existe pas : un tarif unique s'applique.
            </p>
          </article>
        </div>
      </Section>

      <Section
        titre="La vie de l'école"
        chapeau="Trois moments rythment l'année, et sont financés par une cotisation distincte des frais de scolarité."
      >
        <div className="galerie">
          <figure className="photo" style={{ margin: 0 }}>
            <img src={img("discours.jpg")} alt="Cérémonie d'émulation" loading="lazy" />
            <figcaption>
              <strong>La cérémonie d'émulation</strong> — les résultats sont
              proclamés devant toute l'école et les familles.
            </figcaption>
          </figure>
          <figure className="photo" style={{ margin: 0 }}>
            <img src={img("remise-prix.jpg")} alt="Remise des prix" loading="lazy" />
            <figcaption>
              <strong>La remise des prix</strong> — les lauréats reçoivent leurs
              lots devant leurs parents.
            </figcaption>
          </figure>
          <figure className="photo" style={{ margin: 0 }}>
            <img src={img("sortie-parc.jpg")} alt="Sortie scolaire" loading="lazy" />
            <figcaption>
              <strong>La sortie scolaire</strong> — une journée hors des murs,
              en fin d'année.
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section claire>
        <div className="encart">
          <h2>Inscriptions {ecole.anneeScolaire}</h2>
          <p>
            Contactez la Direction pour connaître les places disponibles et les
            pièces à fournir.
          </p>
          <Link className="btn btn-orange" to="/contact">
            Nous joindre
          </Link>
        </div>
      </Section>
    </>
  );
}
