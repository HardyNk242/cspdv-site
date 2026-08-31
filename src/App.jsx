import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import { Navbar, Footer } from "./composants/Mise";
import Accueil from "./pages/Accueil";
import Ecole from "./pages/Ecole";
import Tarifs from "./pages/Tarifs";
import Bourses from "./pages/Bourses";
import Donateurs from "./pages/Donateurs";
import Galerie from "./pages/Galerie";
import Contact from "./pages/Contact";

// Sans cela, on arrive au milieu de la page suivante après un clic.
//
// Deux précautions, apprises d'un vrai défaut : on voyait une page blanche
// au changement de page, et il fallait recharger.
//   · useLayoutEffect et non useEffect : le défilement a lieu AVANT le
//     premier affichage, donc on ne voit jamais la position intermédiaire.
//   · behavior "instant" : la feuille de style met `scroll-behavior: smooth`
//     pour les ancres. Sans ce forçage, le navigateur ANIME le retour en
//     haut — et pendant l'animation on regarde le vide sous une page plus
//     courte que la précédente. C'était toute l'explication du blanc.
function RemonterEnHaut() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    // HashRouter et non BrowserRouter : sur GitHub Pages, un lien direct
    // vers /bourses renverrait une 404, faute de serveur pour réécrire
    // les routes. Le # règle le problème sans configuration.
    <HashRouter>
      <RemonterEnHaut />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/ecole" element={<Ecole />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/bourses" element={<Bourses />} />
          <Route path="/donateurs" element={<Donateurs />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Accueil />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}
