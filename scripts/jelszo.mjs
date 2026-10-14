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

// Erős, véletlen jelszó: 4 × 4 karakter, a könnyen összetéveszthetők (0/O, 1/l/I) nélkül, pl. "k7m2-x9pq-4rwt-c3nz"
function generatePassword() {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const chars = [...bytes].map((b) => alphabet[b % alphabet.length]);
  return [0, 4, 8, 12].map((i) => chars.slice(i, i + 4).join('')).join('-');
}

const password = given || generatePassword();
const hash = await hashPassword(password);
console.log(JSON.stringify({ email: email.trim().toLowerCase(), hash }));
console.error(`\nJelszó (${email}): ${password}\n`);
