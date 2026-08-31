import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Section, EnTete } from "../composants/Mise";
import { tarifs, annexes, fr, eur, TAUX_EURO } from "../data/finances";

// Une année complète = 8 mensualités d'octobre à mai + le forfait de juin.
const annee = (mensuel, juin) => (mensuel === null ? null : 8 * mensuel + juin);

export default function Tarifs() {
  let cycleCourant = null;

  return (
    <>
      <EnTete
        titre="Les tarifs"
        chapeau="Tous les montants sont en francs CFA, affichés sans exception ni frais caché."
      />

      <Section
        titre="Mensualités par classe"
        chapeau="Trois régimes sont possibles au primaire : mi-temps, mi-temps avec travaux dirigés, ou plein temps. Le préscolaire et le collège n'en ont pas tous."
      >
        <div className="tableau-enveloppe">
          <table>
            <thead>
              <tr>
                <th>Classe</th>
                <th className="nombre">Mi-temps</th>
                <th className="nombre">Mi-temps + T.D.</th>
                <th className="nombre">Plein temps</th>
                <th className="nombre">Forfait de juin</th>
              </tr>
            </thead>
            <tbody>
              {tarifs.map((t) => {
                const nouveau = t.cycle !== cycleCourant;
                cycleCourant = t.cycle;
                return (
                  // Fragment nommé : sans clé ici, React proteste à chaque
                  // ligne de séparation de cycle.
                  <Fragment key={t.classe}>
                    {nouveau && (
                      <tr className="ligne-cycle">
                        <td colSpan={5}>{t.cycle}</td>
                      </tr>
                    )}
                    <tr>
                      <td><strong>{t.classe}</strong></td>
                      <td className="nombre">{fr(t.base)}</td>
                      <td className={"nombre" + (t.td === null ? " vide" : "")}>
                        {t.td === null ? "—" : fr(t.td)}
                      </td>
                      <td className={"nombre" + (t.pt === null ? " vide" : "")}>
                        {t.pt === null ? "—" : fr(t.pt)}
                      </td>
                      <td className="nombre">{fr(t.juin)}</td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="note" style={{ marginTop: 18 }}>
          Le tiret signifie que ce régime n'existe pas dans cette classe. Au
          préscolaire il n'y a pas de travaux dirigés ; au collège, de la 6ème
          à la 4ème, un tarif unique s'applique, travaux dirigés compris.
        </p>
      </Section>

      <Section
        claire
        titre="Ce que coûte une année complète"
        chapeau="Huit mensualités d'octobre à mai, plus le forfait du mois de juin. Frais annexes non compris."
      >
        <div className="tableau-enveloppe">
          <table>
            <thead>
              <tr>
                <th>Classe</th>
                <th className="nombre">Mi-temps</th>
                <th className="nombre">Mi-temps + T.D.</th>
                <th className="nombre">Plein temps</th>
              </tr>
            </thead>
            <tbody>
              {tarifs.map((t) => (
                <tr key={t.classe}>
                  <td><strong>{t.classe}</strong></td>
                  <td className="nombre">{fr(annee(t.base, t.juin))}</td>
                  <td className={"nombre" + (t.td === null ? " vide" : "")}>
                    {t.td === null ? "—" : fr(annee(t.td, t.juin))}
                  </td>
                  <td className={"nombre" + (t.pt === null ? " vide" : "")}>
                    {t.pt === null ? "—" : fr(annee(t.pt, t.juin))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section titre="Frais annexes">
        <div className="tableau-enveloppe">
          <table>
            <thead>
              <tr>
                <th>Poste</th>
                <th className="nombre">Montant</th>
                <th className="nombre">En euros</th>
              </tr>
            </thead>
            <tbody>
              {annexes.map((a) => (
                <tr key={a.poste}>
                  <td>
                    <strong>{a.poste}</strong>
                    {a.detail && (
                      <div style={{ color: "var(--gris)", fontSize: "0.87rem" }}>
                        {a.detail}
                      </div>
                    )}
                  </td>
                  <td className="nombre">{fr(a.montant)} F</td>
                  <td className="nombre" style={{ color: "var(--gris)" }}>
                    {eur(a.montant)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="note" style={{ marginTop: 18 }}>
          Taux de conversion appliqué : <strong>1 € = {fr(TAUX_EURO)} FCFA</strong>.
          Les montants en euros sont indicatifs ; seuls les montants en francs
          CFA font foi.
        </p>

        <div style={{ marginTop: 24 }}>
          <Link className="btn btn-bleu" to="/bourses">
            Aider un enfant à payer sa scolarité
          </Link>
        </div>
      </Section>
    </>
  );
}
