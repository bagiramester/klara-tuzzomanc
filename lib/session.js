// E-mail + jelszavas belépés az admin felülethez (Cloudflare Pages Functions).
//
// A felhasználók a Cloudflare Pages környezeti változóiban vannak, jelszó helyett csak a
// jelszó lenyomatával (PBKDF2-SHA256). Új lenyomatot a `node scripts/jelszo.mjs` készít.
//
//   ADMIN_USERS     JSON lista: [{"email":"valaki@pelda.hu","hash":"pbkdf2$…"}]  (Secret!)
//   SESSION_SECRET  hosszú véletlen szöveg, ezzel írjuk alá a belépési sütit  (Secret!)
//
// Sikeres belépés után egy aláírt, HttpOnly süti azonosítja a felhasználót 30 napig.
// Jelszó, lenyomat vagy GitHub-token soha nem kerül a böngészőbe.

export const SESSION_COOKIE = 'cms_session';
const SESSION_DAYS = 30;
const PBKDF2_ITERATIONS = 210000;

const enc = new TextEncoder();

export function loginEnabled(env) {
  return Boolean(env.ADMIN_USERS && env.SESSION_SECRET);
}

export function parseUsers(env) {
  try {
    const list = JSON.parse(env.ADMIN_USERS);
    if (!Array.isArray(list)) return [];
    return list
      .filter((u) => u && typeof u.email === 'string' && typeof u.hash === 'string')
      .map((u) => ({ email: u.email.trim().toLowerCase(), hash: u.hash.trim() }));
  } catch {
    return [];
  }
}

// ---- base64url segédek ----
export function bytesToBase64url(bytes) {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function base64urlToBytes(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

// ---- jelszó-lenyomat ----
async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return new Uint8Array(bits);
}

/** "pbkdf2$<iterációk>$<só>$<lenyomat>" formátumú szöveget ad vissza. */
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${bytesToBase64url(salt)}$${bytesToBase64url(hash)}`;
}

export async function verifyPassword(password, stored) {
  const parts = String(stored).split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1000) return false;
  const expected = base64urlToBytes(parts[3]);
  const actual = await pbkdf2(password, base64urlToBytes(parts[2]), iterations);
  return timingSafeEqual(actual, expected);
}

/** E-mail + jelszó ellenőrzése. A felhasználót adja vissza, vagy null-t. */
export async function authenticate(env, email, password) {
  const users = parseUsers(env);
  const wanted = String(email || '').trim().toLowerCase();
  const user = users.find((u) => u.email === wanted);
  // Ismeretlen e-mailnél is lefuttatunk egy lenyomat-számítást, hogy a válaszidő ne áruljon el semmit.
  const ok = await verifyPassword(String(password || ''), user ? user.hash : 'pbkdf2$210000$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  return ok && user ? { email: user.email } : null;
}

// ---- aláírt süti ----
async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function createSessionCookie(env, email) {
  const payload = bytesToBase64url(enc.encode(JSON.stringify({ email, exp: Date.now() + SESSION_DAYS * 86400000 })));
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(env.SESSION_SECRET), enc.encode(payload)));
  const value = `${payload}.${bytesToBase64url(sig)}`;
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`;
}

export const clearSessionCookie = `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

/** A bejelentkezett felhasználót adja vissza ({email}), vagy null-t. */
export async function verifySession(request, env) {
  if (!loginEnabled(env)) return null;
  const cookie = request.headers.get('Cookie') || '';
  const raw = new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`).exec(cookie)?.[1];
  if (!raw) return null;
  const [payload, sig] = raw.split('.');
  if (!payload || !sig) return null;
  try {
    const valid = await crypto.subtle.verify('HMAC', await hmacKey(env.SESSION_SECRET), base64urlToBytes(sig), enc.encode(payload));
    if (!valid) return null;
    const data = JSON.parse(new TextDecoder().decode(base64urlToBytes(payload)));
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    // csak az léphet be, aki még mindig szerepel a listán
    if (!parseUsers(env).some((u) => u.email === data.email)) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

// ---- belépőoldal ----
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function loginPage({ error = '', next = '/admin/', email = '' } = {}) {
  const html = `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Belépés — KLÁRA tűzzománc admin</title>
<link rel="icon" type="image/png" href="/favicon-32.png">
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 1.5rem;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif; font-size: 17px; color: #f3ecdf;
    background: #060f23 radial-gradient(ellipse at top, #0d1d4a 0%, transparent 55%); }
  form { width: 100%; max-width: 24rem; background: rgba(13, 25, 60, .85); border: 1px solid rgba(212,175,55,.35);
    border-radius: 1.25rem; padding: 2rem 1.75rem; box-shadow: 0 30px 60px -30px #000; }
  .logo { display: block; width: 72px; height: 72px; margin: 0 auto 1rem; border-radius: 50%; border: 1px solid rgba(212,175,55,.5); }
  h1 { margin: 0 0 .25rem; text-align: center; font: 500 1.6rem Georgia, "Cormorant Garamond", serif; letter-spacing: .12em; color: #f0d58a; }
  p.sub { margin: 0 0 1.5rem; text-align: center; color: rgba(243,236,223,.65); font-size: .9rem; }
  label { display: block; margin: 1rem 0 .4rem; font-size: .9rem; color: rgba(243,236,223,.8); }
  input { width: 100%; padding: .85rem 1rem; border-radius: 999px; border: 1px solid rgba(212,175,55,.35);
    background: rgba(6,15,35,.7); color: #f3ecdf; font-size: 1.05rem; }
  input:focus { outline: none; border-color: #e0b84a; box-shadow: 0 0 0 3px rgba(224,184,74,.2); }
  button { width: 100%; margin-top: 1.5rem; padding: .95rem; border: 0; border-radius: 999px; font-size: 1.05rem; font-weight: 600;
    color: #060f23; background: linear-gradient(135deg, #f1d47b 0%, #d4a93a 55%, #b57a2c 100%); cursor: pointer; }
  button:hover { box-shadow: 0 8px 28px rgba(212,175,55,.35); }
  .error { margin: 0 0 .5rem; padding: .75rem 1rem; border-radius: .75rem; background: rgba(220,60,60,.15); border: 1px solid rgba(220,60,60,.4); color: #ffb4b4; font-size: .95rem; }
  a.back { display: block; margin-top: 1.25rem; text-align: center; color: rgba(243,236,223,.55); font-size: .85rem; text-decoration: none; }
  a.back:hover { color: #f0d58a; }
</style>
</head>
<body>
<form method="post" action="/api/login" autocomplete="on">
  <img class="logo" src="/favicon-192.png" alt="">
  <h1>KLÁRA</h1>
  <p class="sub">Admin belépés</p>
  ${error ? `<p class="error" role="alert">${escapeHtml(error)}</p>` : ''}
  <input type="hidden" name="next" value="${escapeHtml(next)}">
  <label for="email">E-mail cím</label>
  <input id="email" name="email" type="email" required autocomplete="username" autocapitalize="off" value="${escapeHtml(email)}">
  <label for="password">Jelszó</label>
  <input id="password" name="password" type="password" required autocomplete="current-password">
  <button type="submit">Belépés</button>
  <a class="back" href="/">← Vissza a weboldalra</a>
</form>
</body>
</html>`;
  return new Response(html, {
    status: error ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

/** Csak a saját oldalon belüli útvonalat engedjük tovább (nyílt átirányítás ellen). */
export function safeNext(value) {
  const v = String(value || '');
  return /^\/(?!\/)[^\s]*$/.test(v) ? v : '/admin/';
}
