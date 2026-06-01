#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const jwt = require('jsonwebtoken');

function usage() {
  console.log('Usage: node scripts/generate_jwt.js --id=123 --email=you@example.com --role=Admin [--expires=1h]');
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) usage();

const payload = {};
let expires = process.env.JWT_EXPIRES_IN || '24h';

args.forEach(arg => {
  const [k, v] = arg.replace(/^--/, '').split('=');
  if (!v) return;
  if (k === 'expires') expires = v;
  else payload[k] = isNaN(v) ? v : Number(v);
});

if (!payload.id && !payload.email) {
  console.error('Provide at least --id or --email');
  usage();
}

const secret = process.env.JWT_SECRET;
if (!secret) {
  console.error('JWT_SECRET not set in backend/.env');
  process.exit(1);
}

const token = jwt.sign(payload, secret, { expiresIn: expires });
console.log(token);
