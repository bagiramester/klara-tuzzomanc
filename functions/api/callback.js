// Cloudflare Pages Function: /api/callback
//
// Csak a GitHub OAuth tartalék üzemmódhoz kell (lásd functions/api/auth.js).
// Ha a Cloudflare Access be van kapcsolva, ez a végpont nem jut szóhoz.

import { cmsHandshake } from '../../lib/access.js';

function withClearedState(response) {
  const headers = new Headers(response.headers);
  headers.append('Set-Cookie', 'cms_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  return new Response(response.body, { status: response.status, headers });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = /(?:^|;\s*)cms_oauth_state=([^;]+)/.exec(request.headers.get('Cookie') || '')?.[1];

  if (!code || !state || !savedState || state !== savedState) {
    return withClearedState(
      cmsHandshake(url.origin, 'error', { message: 'Érvénytelen vagy lejárt bejelentkezési kérés. Próbáld újra.' }),
    );
  }

  let data;
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'klara-tuzzomanc-cms' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/api/callback`,
      }),
    });
    data = await res.json();
  } catch {
    data = {};
  }

  if (!data.access_token) {
    return withClearedState(
      cmsHandshake(url.origin, 'error', {
        message: data.error_description || 'A GitHub bejelentkezés nem sikerült.',
      }),
    );
  }
  return withClearedState(
    cmsHandshake(url.origin, 'success', { token: data.access_token, provider: 'github' }),
  );
}
