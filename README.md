# Klára tűzzománc — Ékszerkatalógus

Kovári Klára tűzzománc ékszereinek bemutató weboldala. Katalógus + érdeklődési űrlap (nem valódi webshop).

**Éles oldal:** [klaratuzzomanc.hu](https://klaratuzzomanc.hu) (élesítés után — addig: GitHub Pages)

## Márka és technikai adatok

- **Domain:** KlaraTuzzomanc.hu
- **Email:** klara.fire.enamel@gmail.com
- **Telefon:** +36 20 484 7050
- **Facebook:** [klara.kovarinebauer](https://www.facebook.com/klara.kovarinebauer)
- **Nyelv:** magyar (30+ női célközönség)
- **Stílus:** kobaltkék + arany sötét alap, világos „galéria” szekciók a termékfotókhoz

## Termékek kezelése

- **Admin felület:** https://klaratuzzomanc.hu/admin (Decap CMS, GitHub-bejelentkezés) — útmutató: [docs/ADMIN-UTMUTATO.md](docs/ADMIN-UTMUTATO.md)
- **Adatok:** `content/termekek/*.json` (termékenként egy fájl), képek: `attached_assets/termekek/`
- Az elkelt (`"sold": true`) vagy hiányos tételeket a build kihagyja (figyelmeztetéssel), lásd `vite-plugin-products.ts`.

## Élesítés

Cloudflare Pages + saját domain — lépésről lépésre: [docs/ELESITES.md](docs/ELESITES.md)

## Képek kezelése

Az `attached_assets/` mappában az **eredeti, nagy felbontású fotók** maradnak (ezek a forrásfájlok).
A build (`vite-imagetools`) ezekből automatikusan kis méretű, reszponzív **WebP** változatokat készít
(360 / 640 / 1000 / 1500 px), és a böngésző mindig csak a kijelzőhöz illő méretet tölti le.

A termékfotókat a `vite-plugin-products.ts` automatikusan `?product` előbeállítással importálja.
Egyéb képeknél:

```ts
import portre from '@assets/klara-portre-2026.jpg?portrait';
```

Előbeállítások (lásd `vite.config.ts`): `?product` (termékfotók), `?portrait` (portré, logó a nyitóképen),
`?logo` (kis logók). A márka-kivágatok az `attached_assets/brand/` mappában vannak.

## Tech stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + vite-imagetools (WebP), saját tárhelyű betűtípusok (@fontsource)
- **Tartalomkezelés:** Decap CMS (git-alapú), bejelentkezés Cloudflare Pages Functions-szel (`functions/api/`)
- **Tárhely:** Cloudflare Pages (statikus), biztonsági fejlécek: `client/public/_headers`
- **Űrlap:** Formspree

## Fejlesztés

```bash
npm install
npm run dev      # fejlesztői szerver
npm run build    # éles build → dist/
npm run check    # TypeScript ellenőrzés
```
