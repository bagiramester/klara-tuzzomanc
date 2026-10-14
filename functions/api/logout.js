// Cloudflare Pages Function: /api/logout — kilépés (a belépési süti törlése)
import { clearSessionCookie } from '../../lib/session.js';

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  return new Response(null, {
    status: 302,
    headers: { Location: `${url.origin}/api/login`, 'Set-Cookie': clearSessionCookie, 'Cache-Control': 'no-store' },
  });
}
