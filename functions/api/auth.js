// Cloudflare Pages Function: /api/auth
//
// Az admin felület (Decap CMS) bejelentkezése. Két üzemmód van, a környezeti változók döntik el:
//
//  1. Cloudflare Access (ez a cél) — ha CF_ACCESS_TEAM_DOMAIN és CF_ACCESS_AUD be van állítva.
//     Ilyenkor a belépést már a Cloudflare elintézte (e-mailes egyszeri kóddal), nekünk csak
//     ellenőriznünk kell az azonosítót. GitHub-fiók nem kell a szerkesztőnek.
//
//  2. GitHub OAuth (a korábbi mód) — ha az Access változók nincsenek beállítva.
//     Ehhez GITHUB_CLIENT_ID és GITHUB_CLIENT_SECRET kell, és minden szerkesztőnek
//     saját GitHub-fiók, írási joggal a tárolóhoz.

import { accessEnabled, verifyAccess, cmsHandshake, AccessError } from '../../lib/access.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  // ─── 1. Cloudflare Access ──────────────────────────────────────────────────
  if (accessEnabled(env)) {
    try {
      await verifyAccess(request, env);
    } catch (err) {
      const message = err instanceof AccessError ? err.message : 'A bejelentkezés ellenőrzése nem sikerült.';
      return cmsHandshake(url.origin, 'error', { message });
    }
    if (!env.GITHUB_TOKEN) {
      return cmsHandshake(url.origin, 'error', {
        message:
          'Hiányzik a GITHUB_TOKEN környezeti változó a Cloudflare Pages beállításaiból ' +
          '(lásd docs/ADMIN-UTMUTATO.md).',
      });
    }
    // A CMS kap egy jelzésértékű tokent. Ez önmagában semmire nem jó: a valódi GitHub-tokent
    // az /api/gh proxy teszi bele a kérésekbe, szerveroldalon.
    return cmsHandshake(url.origin, 'success', { token: 'cf-access-session', provider: 'github' });
  }

  // ─── 2. GitHub OAuth (tartalék) ────────────────────────────────────────────
  if (!env.GITHUB_CLIENT_ID) {
    return cmsHandshake(url.origin, 'error', {
      message:
        'Nincs beállítva bejelentkezési mód. Kapcsold be a Cloudflare Accesst ' +
        '(CF_ACCESS_TEAM_DOMAIN és CF_ACCESS_AUD), vagy add meg a GITHUB_CLIENT_ID értékét.',
    });
  }

  const state = crypto.randomUUID();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  authorize.searchParams.set('scope', env.GITHUB_SCOPE || 'repo,user');
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Cache-Control': 'no-store',
      'Set-Cookie': `cms_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
