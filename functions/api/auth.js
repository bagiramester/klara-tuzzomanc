// Cloudflare Pages Function: /api/auth
// Az admin felület (Decap CMS) GitHub-bejelentkezésének első lépése: átirányít a GitHub engedélyező oldalára.
// Szükséges környezeti változók a Cloudflare Pages beállításaiban: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET.

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (!env.GITHUB_CLIENT_ID) {
    return new Response('Hiányzik a GITHUB_CLIENT_ID környezeti változó (lásd docs/ELESITES.md).', { status: 500 });
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
      'Set-Cookie': `cms_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
}
