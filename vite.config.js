import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Le site est servi sur un domaine propre — https://ecole.kongoscience.org
// — donc depuis la RACINE. Tant qu'il vivait sous
// hardynk242.github.io/cspdv-site/, il fallait ici "/cspdv-site/".
// Si le domaine est un jour retiré, remettre "/cspdv-site/", sinon plus
// aucune image ne s'affichera.
export default defineConfig({
  plugins: [react()],
  base: "/",
});
