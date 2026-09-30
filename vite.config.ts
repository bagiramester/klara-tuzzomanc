import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import path from "node:path";
import fs from "node:fs";
import type { Plugin } from "vite";
import { productsPlugin } from "./vite-plugin-products";

const repoRoot = import.meta.dirname;

// Képméret-előbeállítások. Az eredeti (több MB-os) fotók az attached_assets mappában
// maradnak, a build ezekből kis méretű, reszponzív WebP változatokat generál.
//   '...jpg?product'  → termékfotó (rács + nagyítás)
//   '...jpg?portrait' → portré / nagy illusztráció
//   '...jpg?logo'     → kis logók
const presets: Record<string, Record<string, string>> = {
  product: { w: "360;640;1000;1500", format: "webp", quality: "74", as: "picture" },
  portrait: { w: "480;800;1200", format: "webp", quality: "76", as: "picture" },
  logo: { w: "160;320", format: "webp", quality: "80", as: "picture" },
};

// Figyelmeztet, ha a jogi oldalak adatai (client/src/data/site.ts) még nincsenek kitöltve
const legalCheck = (): Plugin => ({
  name: "klara-legal-check",
  apply: "build",
  buildStart() {
    const site = fs.readFileSync(path.resolve(repoRoot, "client/src/data/site.ts"), "utf8");
    const todo = site.match(/\[KITÖLTENDŐ[^\]]*\]/g);
    if (todo) this.warn(`Az Impresszum / Adatkezelési tájékoztató adatai hiányosak (${todo.length} db [KITÖLTENDŐ] a client/src/data/site.ts fájlban).`);
  },
});

// A nyitókép logója és a fő betűtípusok előtöltése — a böngésző már a JS lefutása előtt letölti őket (gyorsabb LCP)
const preloadCritical = (): Plugin => ({
  name: "klara-preload",
  apply: "build",
  async transformIndexHtml(html, ctx) {
    if (!ctx.bundle) return html;
    const sharp = (await import("sharp")).default;
    const tags: string[] = [];
    const hero: { file: string; w: number }[] = [];
    for (const [file, out] of Object.entries(ctx.bundle)) {
      if (out.type !== "asset") continue;
      if (/klara-logo-hero-.*\.webp$/.test(file)) {
        const { width } = await sharp(Buffer.from(out.source as Uint8Array)).metadata();
        hero.push({ file, w: width ?? 0 });
      }
      if (/(cormorant-garamond-latin-500-normal|manrope-latin-(400|600)-normal)-.*\.woff2$/.test(file)) {
        tags.push(`<link rel="preload" href="./${file}" as="font" type="font/woff2" crossorigin>`);
      }
    }
    if (hero.length) {
      const srcset = hero.sort((a, b) => a.w - b.w).map((h) => `./${h.file} ${h.w}w`).join(", ");
      tags.unshift(
        `<link rel="preload" as="image" imagesrcset="${srcset}" imagesizes="(min-width: 1024px) 400px, (min-width: 640px) 320px, 210px" fetchpriority="high">`,
      );
    }
    return html.replace("</title>", "</title>\n" + tags.join("\n"));
  },
});

export default defineConfig({
  plugins: [
    react(),
    legalCheck(),
    preloadCritical(),
    productsPlugin({ root: repoRoot, contentDir: "content/termekek" }),
    imagetools({
      // kis- és nagybetűs kiterjesztés is (pl. telefonról feltöltött IMG_1234.JPG)
      include: /\.(avif|jpe?g|png|tiff?|webp|gif)(\?.*)?$/i,
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
      "@": path.resolve(repoRoot, "client", "src"),
      "@assets": path.resolve(repoRoot, "attached_assets"),
    },
  },
  root: path.resolve(repoRoot, "client"),
  // relatív útvonalak: működik a saját domainen és a GitHub Pages alkönyvtárában is
  base: "./",
  build: {
    outDir: path.resolve(repoRoot, "dist"),
    emptyOutDir: true,
    // a képek külön fájlként töltődjenek (lazy loading), ne base64-ként a JS-be
    assetsInlineLimit: 0,
  },
  server: {
    fs: {
      strict: true,
      allow: [repoRoot],
      deny: ["**/.*"],
    },
  },
});
