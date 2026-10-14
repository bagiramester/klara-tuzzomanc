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

// Könnyen begépelhető, de erős jelszó: 4 szótagszerű blokk, pl. "Rubin-7Kemence-Zomanc-42"
function generatePassword() {
  const words = ['Zomanc', 'Kemence', 'Rubin', 'Kobalt', 'Arany', 'Ginkgo', 'Medal', 'Bross', 'Tuz', 'Szikra', 'Biloba', 'Patina'];
  const rnd = (n) => crypto.getRandomValues(new Uint32Array(1))[0] % n;
  const pool = [...words];
  const pick = () => pool.splice(rnd(pool.length), 1)[0]; // három különböző szó
  const num = () => rnd(90) + 10;
  return `${pick()}-${pick()}${num()}-${pick()}-${num()}`;
}

const password = given || generatePassword();
const hash = await hashPassword(password);
console.log(JSON.stringify({ email: email.trim().toLowerCase(), hash }));
console.error(`\nJelszó (${email}): ${password}\n`);
