#!/usr/bin/env node
// Admin-jelszó lenyomat készítése az ADMIN_USERS környezeti változóhoz.
//
//   node scripts/jelszo.mjs valaki@pelda.hu            → véletlen jelszót generál és kiírja
//   node scripts/jelszo.mjs valaki@pelda.hu "SajátJelszó"
//
// Az eredményt (egy {"email","hash"} sort) tedd az ADMIN_USERS JSON-listába a Cloudflare Pages
// → Settings → Variables and secrets alatt (Secret típussal), majd Retry deployment.
import { hashPassword } from '../lib/session.js';

const [email, given] = process.argv.slice(2);
if (!email || !email.includes('@')) {
  console.error('Használat: node scripts/jelszo.mjs <e-mail> [jelszó]');
  process.exit(1);
}

// Egyszerű, megjegyezhető jelszó: egy 5 betűs szó + 3 számjegy, pl. "rubin482".
// (A találgatás ellen a belépőoldal 5 hibás próbálkozás után 15 percre zárol.)
function generatePassword() {
  const words = ['rubin', 'arany', 'tuzes', 'kemen', 'szines', 'patin', 'bross', 'medal', 'gyongy', 'ezust', 'korall', 'opal'].filter((w) => w.length === 5);
  const rnd = (n) => crypto.getRandomValues(new Uint32Array(1))[0] % n;
  return `${words[rnd(words.length)]}${100 + rnd(900)}`;
}

const password = given || generatePassword();
const hash = await hashPassword(password);
console.log(JSON.stringify({ email: email.trim().toLowerCase(), hash }));
console.error(`\nJelszó (${email}): ${password}\n`);
