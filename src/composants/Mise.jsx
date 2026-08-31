// Éléments de mise en page réutilisés par toutes les pages.
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ecole } from "../data/ecole";

const base = import.meta.env.BASE_URL;
export const img = (fichier) => `${base}images/${fichier}`;

const pages = [
  { to: "/", libelle: "Accueil" },
  { to: "/ecole", libelle: "L'école" },
  { to: "/tarifs", libelle: "Tarifs" },
  { to: "/bourses", libelle: "Bourses" },
  { to: "/donateurs", libelle: "Donateurs" },
  { to: "/galerie", libelle: "Galerie" },
  { to: "/contact", libelle: "Contact" },
];

export function Navbar() {
  const [ouvert, setOuvert] = useState(false);
  return (
    <nav className="navbar">
      <div className="conteneur navbar-inner">
        <Link to="/" className="marque" onClick={() => setOuvert(false)}>
          <img src={img("logo.png")} alt="" />
          <span>
            <span className="marque-nom">Professeur Dieu-Veille</span>
            <br />
            <span className="marque-sous">{ecole.ville}</span>
          </span>
        </Link>

        <button
          className="burger"
          onClick={() => setOuvert((o) => !o)}
          aria-expanded={ouvert}
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>

        <div className={"liens" + (ouvert ? " ouvert" : "")}>
          {pages.map((p) => (
            <NavLink
              key={p.to}
              to={p.to}
              end={p.to === "/"}
              className={({ isActive }) => (isActive ? "actif" : "")}
              onClick={() => setOuvert(false)}
            >
              {p.libelle}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="conteneur">
        <div className="grille grille-3">
          <div>
            <h4>{ecole.nom}</h4>
            <p style={{ margin: 0, fontSize: "0.92rem" }}>
              {ecole.devise}
              <br />
              {ecole.ville}, {ecole.pays}
            </p>
          </div>
          <div>
            <h4>Nous joindre</h4>
            {ecole.telephones.map((t) => (
              <a key={t} href={"tel:+242" + t.replace(/\s/g, "")}>
                {t}
              </a>
            ))}
          </div>
          <div>
            <h4>Le site</h4>
            {pages.slice(1).map((p) => (
              <Link key={p.to} to={p.to}>
                {p.libelle}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-bas">
          <span>© {new Date().getFullYear()} {ecole.nom}</span>
          <span>Année scolaire {ecole.anneeScolaire}</span>
        </div>
      </div>
    </footer>
  );
}

export function Section({ titre, chapeau, claire, children, id }) {
  return (
    <section className={"section" + (claire ? " section-claire" : "")} id={id}>
      <div className="conteneur">
        {titre && (
          <>
            <h2>{titre}</h2>
            <div className="barre" />
          </>
        )}
        {chapeau && <p className="chapeau">{chapeau}</p>}
        {children}
      </div>
    </section>
  );
}

// Bandeau de tête des pages intérieures.
export function EnTete({ titre, chapeau }) {
  return (
    <div className="hero">
      <img className="fond" src={img("banniere.jpg")} alt="" />
      <div className="hero-contenu conteneur" style={{ padding: "52px 20px" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>{titre}</h1>
        {chapeau && <p className="accroche" style={{ marginBottom: 0 }}>{chapeau}</p>}
      </div>
    </div>
  );
}
