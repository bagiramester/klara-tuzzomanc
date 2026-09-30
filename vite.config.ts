import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import path from "node:path";

// Képméret-előbeállítások. Az eredeti (több MB-os) fotók az attached_assets mappában
// maradnak, a build ezekből kis méretű, reszponzív WebP változatokat generál.
//   import kep from '@assets/valami.jpg?product'  → termékfotó (rács + nagyítás)
//   import kep from '@assets/valami.jpg?portrait' → portré / nagy illusztráció
//   import kep from '@assets/valami.jpg?logo'     → kis logók
const presets: Record<string, Record<string, string>> = {
  product: { w: "360;640;1000;1500", format: "webp", quality: "74", as: "picture" },
  portrait: { w: "480;800;1200", format: "webp", quality: "76", as: "picture" },
  logo: { w: "160;320", format: "webp", quality: "80", as: "picture" },
};

export default defineConfig({
  plugins: [
    react(),
    imagetools({
      defaultDirectives: (url) => {
        for (const [name, directives] of Object.entries(presets)) {
          if (url.searchParams.has(name)) return new URLSearchParams(directives);
        }
        return new URLSearchParams();
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: "./",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // a képek külön fájlként töltődjenek (lazy loading), ne base64-ként a JS-be
    assetsInlineLimit: 0,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
