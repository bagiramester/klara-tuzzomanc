// Cloudflare Pages Function: /api/callback
// A GitHub ide irányít vissza. A kódot hozzáférési tokenre cseréljük, és a Decap CMS szabványos
// üzenetküldéses kézfogásával (postMessage) visszaadjuk az admin ablaknak — csak a saját domainnek.

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = /(?:^|;\s*)cms_oauth_state=([^;]+)/.exec(request.headers.get('Cookie') || '')?.[1];

  if (!code || !state || !savedState || state !== savedState) {
    return reply(url.origin, 'error', { message: 'Érvénytelen vagy lejárt bejelentkezési kérés. Próbáld újra.' });
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
    return reply(url.origin, 'error', { message: data.error_description || 'A GitHub bejelentkezés nem sikerült.' });
  }
  return reply(url.origin, 'success', { token: data.access_token, provider: 'github' });
}

function reply(origin, status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  // a JSON-t biztonságosan ágyazzuk be a <script>-be
  const js = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
  const html = `<!doctype html><html lang="hu"><head><meta charset="utf-8"><title>Bejelentkezés…</title></head>
<body style="font-family:system-ui;padding:2rem">${status === 'success' ? 'Sikeres bejelentkezés, az ablak bezárható.' : 'Hiba: ' + escapeHtml(content.message)}
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
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': 'cms_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
