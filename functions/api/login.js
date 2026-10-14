// Cloudflare Pages Function: /api/login
// E-mail + jelszavas belépőoldal az adminhoz (lásd lib/session.js).

import { loginEnabled, loginPage, authenticate, createSessionCookie, verifySession, safeNext, clientIp, isLocked, noteFailure, noteSuccess } from '../../lib/session.js';

const notConfigured = () =>
  new Response('A belépés nincs beállítva: hiányzik az ADMIN_USERS vagy a SESSION_SECRET környezeti változó (lásd docs/ELESITES.md).', {
    status: 500,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

export async function onRequestGet({ request, env }) {
  if (!loginEnabled(env)) return notConfigured();
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get('next'));
  if (await verifySession(request, env)) {
    return Response.redirect(`${url.origin}${next}`, 302);
  }
  return loginPage({ next });
}

export async function onRequestPost({ request, env }) {
  if (!loginEnabled(env)) return notConfigured();
  const url = new URL(request.url);
  const form = await request.formData();
  const email = String(form.get('email') || '');
  const password = String(form.get('password') || '');
  const next = safeNext(form.get('next'));
  const ip = clientIp(request);

  if (isLocked(ip)) {
    return loginPage({ error: 'Túl sok sikertelen próbálkozás. Várj 15 percet, és próbáld újra.', next, email });
  }

  let user = null;
  try {
    user = await authenticate(env, email, password);
  } catch {
    user = null;
  }
  if (!user) {
    noteFailure(ip);
    // kis késleltetés: a találgatást lassítja
    await new Promise((r) => setTimeout(r, 1200));
    return loginPage({ error: 'Hibás e-mail cím vagy jelszó.', next, email });
  }
  noteSuccess(ip);

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${url.origin}${next}`,
      'Set-Cookie': await createSessionCookie(env, user.email),
      'Cache-Control': 'no-store',
    },
  });
}
