// Cloudflare Pages Function: /api/gh/*
//
// A Decap CMS minden GitHub-hívása ezen megy keresztül (lásd az admin `api_root` beállítását).
// Ha a Cloudflare Access be van kapcsolva, a hozzáférési tokent **itt, szerveroldalon** tesszük
// a kérésbe — így a böngészőbe soha nem kerül olyan token, amivel a tárolót írni lehetne.
//
// Környezeti változók:
//   GITHUB_TOKEN   finomhangolt személyes hozzáférési token (Secret típussal!),
//                  csak a klara-tuzzomanc tárolóhoz, Contents: Read and write joggal
//   CF_ACCESS_*    lásd lib/access.js

import { verifyAccess, accessEnabled, AccessError } from '../../../lib/access.js';
import { loginEnabled, verifySession } from '../../../lib/session.js';

const GITHUB_API = 'https://api.github.com';

// Amit a böngészőtől továbbengedünk a GitHub felé. A többit (süti, Access-fejlécek) eldobjuk.
const FORWARD_REQUEST_HEADERS = ['accept', 'content-type', 'if-none-match', 'if-modified-since'];
const FORWARD_RESPONSE_HEADERS = ['content-type', 'etag', 'last-modified', 'x-ratelimit-remaining'];

function problem(message, status) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function onRequest({ request, env, params }) {
  const usingLogin = loginEnabled(env);
  const usingAccess = !usingLogin && accessEnabled(env);
  const guarded = usingLogin || usingAccess;
  const serverToken = env.GITHUB_TOKEN;

  // Biztonsági kapu: szerveroldali tokent csak akkor használunk, ha belépés is védi.
  // Enélkül ez nyitott írási proxy lenne bárkinek.
  if (serverToken && !guarded) {
    return problem(
      'Hibás beállítás: a GITHUB_TOKEN be van állítva, de nincs belépés (ADMIN_USERS + SESSION_SECRET, ' +
        'vagy CF_ACCESS_TEAM_DOMAIN + CF_ACCESS_AUD). Addig a szerveroldali token nem használható.',
      500,
    );
  }

  if (usingLogin && !(await verifySession(request, env))) {
    return problem('Nincs bejelentkezve. Nyisd meg újra az /admin oldalt, és lépj be.', 401);
  }

  if (guarded) {
    if (usingAccess) {
      try {
        await verifyAccess(request, env);
      } catch (err) {
        const message = err instanceof AccessError ? err.message : 'A bejelentkezés ellenőrzése nem sikerült.';
        return problem(message, 401);
      }
    }
    if (!serverToken) {
      return problem(
        'Hiányzik a GITHUB_TOKEN környezeti változó. A Cloudflare Pages beállításaiban vedd fel ' +
          'Secret típussal (lásd docs/ADMIN-UTMUTATO.md).',
        500,
      );
    }
  }

  // Belépés nélkül a régi mód él: a böngésző saját GitHub-tokenjével megy a kérés.
  const authorization = serverToken
    ? `token ${serverToken}`
    : request.headers.get('Authorization');
  if (!authorization) {
    return problem('Nincs bejelentkezve. Nyisd meg újra az /admin oldalt.', 401);
  }

  const segments = params.path;
  const path = (Array.isArray(segments) ? segments.join('/') : segments || '').replace(/^\/+/, '');
  const url = new URL(request.url);
  const target = `${GITHUB_API}/${path}${url.search}`;

  const headers = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('Authorization', authorization);
  headers.set('User-Agent', 'klara-tuzzomanc-cms');
  if (!headers.has('accept')) headers.set('Accept', 'application/vnd.github+json');

  const method = request.method.toUpperCase();
  const hasBody = method !== 'GET' && method !== 'HEAD';

  let upstream;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: 'follow',
    });
  } catch {
    return problem('Nem sikerült elérni a GitHubot. Próbáld újra néhány másodperc múlva.', 502);
  }

  // Belépés mellett a token a tárolóé, nem Kláráé — a felső sávban ne egy idegen GitHub-név
  // jelenjen meg. Csak a megjelenített nevet írjuk át, minden más mező marad.
  if (guarded && path === 'user' && method === 'GET' && upstream.ok) {
    try {
      const user = await upstream.json();
      return new Response(JSON.stringify({ ...user, name: 'KLÁRA tűzzománc' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    } catch {
      return problem('A GitHub válasza értelmezhetetlen volt.', 502);
    }
  }

  const outHeaders = new Headers();
  for (const name of FORWARD_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) outHeaders.set(name, value);
  }
  // A lapozási hivatkozások is a saját proxynkra mutassanak, különben a böngésző
  // közvetlenül az api.github.com felé menne — ott pedig nincs tokenje.
  const link = upstream.headers.get('link');
  if (link) outHeaders.set('Link', link.split(GITHUB_API).join(`${url.origin}/api/gh`));
  outHeaders.set('Cache-Control', 'no-store');

  return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
}
