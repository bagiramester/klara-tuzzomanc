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

## 4. Admin bejelentkezés (Cloudflare Access, e-mailes kóddal)

Klárának **nem kell GitHub-fiók**. A belépést a Cloudflare Access intézi: beírja az e-mail címét,
kap egy hatjegyű kódot, és belép. A GitHub-tokent a szerveroldal teszi a kérésekbe — a böngészőbe
soha nem kerül olyan token, amivel a tárolót írni lehetne.

**a) Hozzáférési token a tárolóhoz**

GitHub → [Fine-grained tokens](https://github.com/settings/personal-access-tokens) → **Generate new token**

| Mező | Érték |
|---|---|
| Repository access | Only select repositories → `klara-tuzzomanc` |
| Permissions → Contents | Read and write |
| Expiration | legfeljebb 1 év — a lejárat előtt újat kell generálni |

Más jogosultság nem kell. A commitok ennek a tokennek a tulajdonosa nevében készülnek,
tehát a git-előzményben az ő neve fog szerepelni akkor is, ha Klára szerkesztett.

**b) Access alkalmazás**

Cloudflare → **Zero Trust** → **Access** → **Applications** → **Add an application** → **Self-hosted**

- Alkalmazás neve: `Klára tűzzománc admin`
- Public hostname: `klaratuzzomanc.hu`, útvonal: `admin`
- Vegyél fel egy **második** hostnamet ugyanehhez az alkalmazáshoz: `klaratuzzomanc.hu`, útvonal: `api`
  (enélkül a mentés nem működne, mert a CMS hívásai védtelenül mennének)
- Policy: **Allow**, Include → **Emails** → Klára és a te címed
- Login methods: **One-time PIN**

Létrehozás után másold ki az **Application Audience (AUD) Tag** értékét.

**c) Környezeti változók**

Cloudflare Pages projekt → **Settings → Variables and secrets** (Production):

| Név | Érték | Típus |
|---|---|---|
| `CF_ACCESS_TEAM_DOMAIN` | pl. `bagiramester.cloudflareaccess.com` | Text |
| `CF_ACCESS_AUD` | az AUD Tag | Text |
| `GITHUB_TOKEN` | az a) pontban készült token | **Secret** |

Ezután **Deployments → Retry deployment**, hogy a változók életbe lépjenek.

> A `GITHUB_TOKEN` csak akkor használható, ha a két `CF_ACCESS_*` változó is be van állítva.
> Access nélkül a proxy szándékosan megtagadja a szolgálatot — különben bárki írhatná a tárolót.

**Sorrend a domainnel:** előbb vedd fel a domaint a Pages projekthez (Custom domains), és csak
utána hozd létre rá az Access alkalmazást. Fordítva a Cloudflare nem engedi hozzáadni a domaint.

**Tartalék mód.** Ha a `CF_ACCESS_*` változók nincsenek beállítva, a régi GitHub OAuth belépés él
(`GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET`, OAuth App callback URL-je `…/api/callback`).
Ilyenkor minden szerkesztőnek saját GitHub-fiók kell, írási joggal a tárolóhoz.

## 5. Ha valakit ki kell zárni

Cloudflare → Zero Trust → Access → Applications → az alkalmazás → a policy-ból töröld az e-mail címét.
Azonnal hatályos, nem kell se jelszót cserélni, se tokent újragenerálni.

Ha maga a `GITHUB_TOKEN` szivárogna ki, a GitHubon vond vissza
([Fine-grained tokens](https://github.com/settings/personal-access-tokens) → Revoke), generálj újat,
és írd át a Cloudflare-változót.

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
