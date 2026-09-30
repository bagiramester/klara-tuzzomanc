# Élesítés — klaratuzzomanc.hu

Az oldal **statikus weboldal** a Cloudflare Pages-en (ingyenes tárhely, nincs szerver és adatbázis).
A termékek a GitHub-tárolóban vannak (`content/termekek/*.json` + `attached_assets/termekek/` képek),
az admin felület (`/admin`) ide menti a változásokat, és minden mentés után a Cloudflare 1–2 perc alatt
újraépíti az oldalt.

```
Klára ─► klaratuzzomanc.hu/admin ─► GitHub (main ág) ─► Cloudflare Pages build ─► klaratuzzomanc.hu
```

Költség: csak a domain (.hu, kb. 3–6 000 Ft/év). A Cloudflare Pages, a GitHub és a Formspree (havi 50 üzenetig) ingyenes.

---

## 1. Domain

1. Regisztráld a **klaratuzzomanc.hu** domaint egy magyar regisztrátornál (pl. Rackhost, Tárhely.eu, Domain.hu).
   *Tárhely csomag nem kell, csak a domain.*
2. Hozz létre egy ingyenes fiókot a [Cloudflare](https://dash.cloudflare.com)-en → **Add a domain** → `klaratuzzomanc.hu` → *Free* csomag.
3. A Cloudflare megad két névszervert (pl. `xxx.ns.cloudflare.com`). Ezeket állítsd be a regisztrátornál a domain
   névszervereinek. (Az átállás néhány órától 1–2 napig tarthat.)

## 2. Kód a `main` ágra

Olvaszd be ezt az ágat a `main`-be (Pull request → Merge). Az admin a `main` ágra ment, a Cloudflare is abból épít.

## 3. Cloudflare Pages projekt

Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → `bagiramester/klara-tuzzomanc`

| Beállítás | Érték |
|---|---|
| Production branch | `main` |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Környezeti változó (nem kötelező) | `NODE_VERSION` = `22` (a `.node-version` fájl ezt már beállítja) |

Az első build ~1 perc. Utána a projekt → **Custom domains** → add hozzá: `klaratuzzomanc.hu` és `www.klaratuzzomanc.hu`.
A `www` → főoldal átirányításhoz: Cloudflare → a domain → **Rules → Redirect Rules** → „Redirect from WWW to root” sablon.

A `functions/` mappában lévő admin-bejelentkezést a Cloudflare automatikusan felismeri (Pages Functions).

## 4. Admin bejelentkezés (GitHub OAuth App)

1. GitHub → jobb felső sarok → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Application name: `Klára tűzzománc admin`
   - Homepage URL: `https://klaratuzzomanc.hu`
   - Authorization callback URL: `https://klaratuzzomanc.hu/api/callback`
2. Létrehozás után másold ki a **Client ID**-t, majd **Generate a new client secret** → másold ki.
3. Cloudflare Pages projekt → **Settings → Variables and Secrets** (Production):
   - `GITHUB_CLIENT_ID` = a Client ID (Text)
   - `GITHUB_CLIENT_SECRET` = a secret (**Secret** / Encrypt)
4. **Deployments → Retry deployment** (hogy a változók életbe lépjenek).

## 5. Klára hozzáférése

1. Klára regisztráljon egy ingyenes fiókot a [github.com](https://github.com/signup)-on (e-mail + jelszó).
   Javasolt a kétlépcsős azonosítás bekapcsolása.
2. A tárolóban: **Settings → Collaborators → Add people** → Klára felhasználóneve → *Write* jog.
3. Klára elfogadja a meghívót (e-mailben kapja), és ettől kezdve be tud lépni: **https://klaratuzzomanc.hu/admin**
   → „Login with GitHub”.

Csak az léphet be az adminba, akinek írási joga van a tárolóhoz. Minden változás verziózott: ha valami elromlik,
a GitHubon bármelyik korábbi állapot visszaállítható.

## 6. Kötelező adatok kitöltése

`client/src/data/site.ts` — az Impresszum és az Adatkezelési tájékoztató adatai. Töltsd ki a `[KITÖLTENDŐ]`
mezőket (cím, telefon, adószám / nyilvántartási szám — ami nincs, azt hagyd üresen: `''`).
Amíg maradt kitöltetlen mező, a build figyelmeztet.

> A jogi szövegek sablonok, a jelenlegi működéshez (érdeklődő űrlap, nincs online fizetés, nincsenek sütik) igazítva.
> Ha később kosár/online fizetés lesz, ÁSZF is kell, és érdemes jogásszal átnézetni.

## 7. Űrlap (Formspree)

Az érdeklődő űrlap a Formspree-n keresztül küld e-mailt (`formspree.io/f/xzdnpepn`).
- Ellenőrizd a Formspree fiókban, hogy **Klára e-mail címére** érkeznek-e a levelek.
- Form → Settings → **Restrict to Domain**: `klaratuzzomanc.hu` (spam ellen).
- Az ingyenes csomag havi 50 üzenetet enged.

## 8. Élesítés utáni teendők

- [ ] https://klaratuzzomanc.hu betölt, a lakat (HTTPS) rendben
- [ ] `www.` → átirányít a főoldalra
- [ ] Űrlap: küldj egy próbaüzenetet, megérkezik Klárának
- [ ] Admin: belépés, egy termék szerkesztése, mentés → 1–2 perc múlva látszik az oldalon
- [ ] [Google Search Console](https://search.google.com/search-console): domain hozzáadása, `https://klaratuzzomanc.hu/sitemap.xml` beküldése
- [ ] Facebook-oldalon a weboldal címének frissítése (a megosztási előnézet: [Sharing Debugger](https://developers.facebook.com/tools/debug/))
- [ ] A régi GitHub Pages telepítés kikapcsolása: GitHub → Actions → „Deploy to GitHub Pages” → ⋯ → *Disable workflow*

## Helyi fejlesztés

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # éles build a dist/ mappába
npm run check        # TypeScript ellenőrzés

# Admin felület helyben, GitHub nélkül (a fájlokat közvetlenül a gépen írja):
npx decap-server     # külön terminálban
# majd: http://localhost:5173/admin/
```
