import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar, Footer } from "./composants/Mise";
import Accueil from "./pages/Accueil";
import Ecole from "./pages/Ecole";
import Tarifs from "./pages/Tarifs";
import Bourses from "./pages/Bourses";
import Donateurs from "./pages/Donateurs";
import Galerie from "./pages/Galerie";
import Contact from "./pages/Contact";

// Sans cela, on arrive au milieu de la page suivante après un clic.
function RemonterEnHaut() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
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
