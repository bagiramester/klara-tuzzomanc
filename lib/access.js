// Cloudflare Access azonosítás ellenőrzése a Pages Function-ökben.
//
// Ha az Access be van kapcsolva az /admin és az /api útvonalakon, a Cloudflare minden
// kérés elé tesz egy aláírt azonosítót (JWT). Ez a modul ellenőrzi az aláírást, a lejáratot,
// a kibocsátót és azt, hogy tényleg a mi alkalmazásunkhoz szól-e.
//
// Szükséges környezeti változók (Cloudflare Pages → Settings → Variables and secrets):
//   CF_ACCESS_TEAM_DOMAIN   pl. "bagiramester.cloudflareaccess.com"
//   CF_ACCESS_AUD           az Access alkalmazás "Application Audience (AUD) Tag" értéke
//
// Amíg ez a kettő nincs beállítva, az Access ki van kapcsolva, és a régi GitHub-bejelentkezés él.

export class AccessError extends Error {}

const JWKS_TTL_MS = 60 * 60 * 1000; // a kulcsokat egy óráig tartjuk meg
let jwksCache = { domain: '', keys: null, expiresAt: 0 };

/** Be van-e kapcsolva az Access ezen a telepítésen? */
export function accessEnabled(env) {
  return Boolean(env.CF_ACCESS_TEAM_DOMAIN && env.CF_ACCESS_AUD);
}

function base64urlToBytes(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64urlToJson(value) {
  return JSON.parse(new TextDecoder().decode(base64urlToBytes(value)));
}

async function publicKeys(teamDomain) {
  const now = Date.now();
  if (jwksCache.keys && jwksCache.domain === teamDomain && jwksCache.expiresAt > now) {
    return jwksCache.keys;
  }
  const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new AccessError('Nem sikerült lekérni a Cloudflare Access aláíró kulcsait.');
  }
  const body = await res.json();
  const keys = Array.isArray(body.keys) ? body.keys : [];
  jwksCache = { domain: teamDomain, keys, expiresAt: now + JWKS_TTL_MS };
  return keys;
}

function tokenFromRequest(request) {
  const header = request.headers.get('Cf-Access-Jwt-Assertion');
  if (header) return header;
  const cookie = request.headers.get('Cookie') || '';
  return /(?:^|;\s*)CF_Authorization=([^;]+)/.exec(cookie)?.[1] || '';
}

/**
 * Visszaadja a bejelentkezett felhasználót, vagy hibát dob.
 * Ha az Access nincs bekapcsolva, null-lal tér vissza — ilyenkor a hívó dönti el, mit tesz.
 */
export async function verifyAccess(request, env) {
  if (!accessEnabled(env)) return null;

  const teamDomain = env.CF_ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const token = tokenFromRequest(request);
  if (!token) {
    throw new AccessError('Nincs érvényes bejelentkezés. Nyisd meg újra az /admin oldalt.');
  }

  const parts = token.split('.');
  if (parts.length !== 3) throw new AccessError('Hibás formátumú bejelentkezési azonosító.');
  const [rawHeader, rawPayload, rawSignature] = parts;

  let header;
  let payload;
  try {
    header = base64urlToJson(rawHeader);
    payload = base64urlToJson(rawPayload);
  } catch {
    throw new AccessError('Olvashatatlan bejelentkezési azonosító.');
  }

  const jwk = (await publicKeys(teamDomain)).find((k) => k.kid === header.kid);
  if (!jwk) throw new AccessError('Ismeretlen aláíró kulcs — próbálj újra bejelentkezni.');

  const key = await crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    base64urlToBytes(rawSignature),
    new TextEncoder().encode(`${rawHeader}.${rawPayload}`),
  );
  if (!valid) throw new AccessError('A bejelentkezési azonosító aláírása érvénytelen.');

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === 'number' && payload.exp < now) {
    throw new AccessError('A bejelentkezés lejárt. Frissítsd az oldalt és lépj be újra.');
  }
  if (typeof payload.nbf === 'number' && payload.nbf > now + 60) {
    throw new AccessError('A bejelentkezési azonosító még nem érvényes.');
  }
  if (payload.iss !== `https://${teamDomain}`) {
    throw new AccessError('A bejelentkezés nem a megfelelő Access-fiókból származik.');
  }
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(env.CF_ACCESS_AUD)) {
    throw new AccessError('A bejelentkezés nem ehhez az alkalmazáshoz szól.');
  }

  return { email: payload.email || '', sub: payload.sub || '' };
}

/**
 * A Decap CMS bejelentkezési kézfogása: a felugró ablak ezzel adja vissza az eredményt
 * a mögötte lévő admin ablaknak. Csak a saját origin felé üzenünk.
 */
export function cmsHandshake(origin, status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const js = (value) => JSON.stringify(value).replace(/</g, '\\u003c');
  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  const html = `<!doctype html><html lang="hu"><head><meta charset="utf-8"><title>Bejelentkezés…</title></head>
<body style="font-family:system-ui;padding:2rem">${
    status === 'success' ? 'Sikeres bejelentkezés, az ablak bezárható.' : 'Hiba: ' + escapeHtml(content.message)
  }
<script>
(function () {
  var origin = ${js(origin)};
  var message = ${js(message)};
  function receive(e) {
    if (e.origin !== origin) return;
    window.removeEventListener('message', receive);
    e.source.postMessage(message, origin);
    ${status === 'success' ? 'setTimeout(function () { window.close(); }, 300);' : ''}
  }
  window.addEventListener('message', receive);
  if (window.opener) window.opener.postMessage('authorizing:github', origin);
})();
</script></body></html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
