# Klára tűzzománc — Ékszerkatalógus

Kovári Klára tűzzománc ékszereinek bemutató weboldala. Katalógus + érdeklődési űrlap (nem valódi webshop).

**Élő oldal:** [klaratuzzomanc.pplx.app](https://klaratuzzomanc.pplx.app)

## Márka és technikai adatok

- **Domain:** KlaraTuzzomanc.hu
- **Email:** klara.fire.enamel@gmail.com
- **Telefon:** +36 20 484 7050
- **Facebook:** [klara.kovarinebauer](https://www.facebook.com/klara.kovarinebauer)
- **Nyelv:** magyar (30+ női célközönség)
- **Stílus:** kobaltkék + arany, sötét téma

## Kategóriák

1. Medálok (42)
2. Fülbevalók (18)
3. Karkötők (13)
4. Brossok (2)
5. Szettek (2)

Összesen 77 termék. A `products.ts` csak azokat az elemeket jeleníti meg, amelyekhez tényleges fotó tartozik:

```ts
export const products = allProducts.filter(p => !!p.image)
```

## Tech stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + Radix UI
- **Backend:** Express 5 + better-sqlite3 + Drizzle ORM
- **Deploy target:** Node.js szerver (jelenleg pplx.app)

## Fejlesztés

```bash
# Függőségek telepítése
npm install

# Fejlesztői szerver (localhost:5173 vagy hasonló)
npm run dev

# Éles build
npm run build

# Éles indítás
npm start

# TypeScript ellenőrzés
npm run check

# Adatbázis migráció (Drizzle)
npm run db:push
```

## Projektstruktúra

```
klara-tuzzomanc/
├── client/                 # React frontend
│   └── src/
│       ├── data/
│       │   └── products.ts # Termékkatalógus
│       ├── components/
│       └── pages/
├── server/                 # Express backend
├── shared/                 # Közös típusok (client + server)
├── script/                 # Build szkript
├── attached_assets/        # Termékfotók, logók, portré
│   ├── uj-medalok-v2/     # M22–M42 medálok
│   ├── uj-millefiori-medalok/  # M11–M21
│   ├── uj-medalok/        # M1–M10 biloba
│   ├── uj-fulbevalok-v2/  # F fülbevalók
│   └── uj-karkotok/       # K karkötők
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── drizzle.config.ts
```

## Termékazonosítási konvenció

- `m1-biloba` … `m10-biloba` — ginkgo biloba medálok
- `m11-millefiori` … `m21-millefiori` — millefiori medálok (M20 = krém-narancs)
- `m22-millefiori` … `m28-millefiori` — új millefiori medálok
- `m29` … `m42` — új medálok különféle technikákkal
- `f1` … `f19` — fülbevalók (F12, F13, F20 nincs; K10 sincs)
- `k1` … `k14` — karkötők (K10 kihagyva)
- `b-*` — brossok
- `s-*` — szettek

## Környezeti változók

Másold a `.env.example` fájlt `.env` néven, és töltsd ki. Az `.env` fájl a `.gitignore`-ban van, sosem kerül a repóba.

## Licenc

MIT
