// Az /admin oldal csak belépés után nyílik meg: belépés nélkül a belépőoldalra irányítunk.
// (Ha az e-mail + jelszavas belépés nincs beállítva, nem avatkozunk be — a többi mód él.)
import { loginEnabled, verifySession } from '../../lib/session.js';

export async function onRequest({ request, env, next }) {
  if (loginEnabled(env) && !(await verifySession(request, env))) {
    const url = new URL(request.url);
    return Response.redirect(`${url.origin}/api/login?next=${encodeURIComponent(url.pathname)}`, 302);
  }
  return next();
}
