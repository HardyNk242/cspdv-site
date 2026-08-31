import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` doit correspondre au NOM DU DÉPÔT GitHub : les fichiers sont
// servis depuis https://<compte>.github.io/<depot>/, pas depuis la racine.
// Si le dépôt est renommé, changer cette ligne, sinon plus aucune image
// ne s'affichera en ligne.
export default defineConfig({
  plugins: [react()],
  base: "/cspdv-site/",
});
