import { Section, EnTete, img } from "../composants/Mise";
import { galerie } from "../data/ecole";

export default function Galerie() {
  return (
    <>
      <EnTete
        titre="L'année en images"
        chapeau="Cérémonie d'émulation, remise des prix, cantine et sortie scolaire."
      />

      <Section>
        <div className="galerie">
          {galerie.map((p) => (
            <figure className="photo" key={p.fichier} style={{ margin: 0 }}>
              <img src={img(p.fichier)} alt={p.legende} loading="lazy" />
              <figcaption>{p.legende}</figcaption>
            </figure>
          ))}
        </div>

        <p className="note" style={{ marginTop: 24 }}>
          Ces photographies ont été prises lors des activités de l'école. Toute
          famille qui ne souhaite pas voir son enfant figurer sur ce site peut
          le faire savoir à la Direction : la photo sera retirée.
        </p>
      </Section>
    </>
  );
}
