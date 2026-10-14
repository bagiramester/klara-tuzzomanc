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

## 4. Admin bejelentkezés (e-mail + jelszó)

Az adminba (`/admin`) e-mail címmel és jelszóval lehet belépni. A felhasználók listája és a
GitHub-kulcs a Cloudflare Pages beállításaiban van, a böngészőbe egyik sem kerül.

Cloudflare Pages projekt → **Settings → Variables and Secrets** (Production), mindhárom **Secret** típussal:

| Változó | Érték |
|---|---|
| `ADMIN_USERS` | JSON-lista a felhasználókról: `[{"email":"…","hash":"pbkdf2$…"}, …]` — a `node scripts/jelszo.mjs <e-mail>` parancs adja (a jelszót is kiírja) |
| `SESSION_SECRET` | hosszú véletlen szöveg, pl. `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `GITHUB_TOKEN` | finomhangolt GitHub token (GitHub → Settings → Developer settings → Fine-grained tokens): csak a `klara-tuzzomanc` tárolóra, **Contents: Read and write** joggal; lejárat 1 év, utána újat kell készíteni |

Utána **Deployments → Retry deployment**. Ettől kezdve: `https://klaratuzzomanc.hu/admin` → belépőoldal → e-mail + jelszó.
A belépés 30 napig marad meg a böngészőben; kilépés: `https://klaratuzzomanc.hu/api/logout`.

> A korábbi módok (Cloudflare Access, GitHub OAuth) is a kódban maradtak tartaléknak; ha az
> `ADMIN_USERS` + `SESSION_SECRET` be van állítva, ez az e-mail + jelszavas mód él.

## 5. Jelszó cseréje, új felhasználó, kizárás

- **Új jelszó / új felhasználó:** `node scripts/jelszo.mjs valaki@pelda.hu` → az eredmény sorát tedd be az
  `ADMIN_USERS` listába (a régi sort cseréld), majd Retry deployment.
- **Kizárás:** vedd ki a sorát az `ADMIN_USERS`-ből → Retry deployment. A meglévő belépése is azonnal érvénytelen.
- Ha a `GITHUB_TOKEN` kiszivárgott volna: GitHub-on vond vissza, készíts újat, írd át a változót.

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
- [ ] Admin: belépés e-mailes kóddal, egy termék szerkesztése, mentés → 1–2 perc múlva látszik az oldalon
- [ ] Klára próbálja ki a saját telefonjáról is, a saját e-mail címével
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
