// api/_token.js
// Lightweight signed token — no JWT library needed, no in-memory state.
// Works perfectly across Vercel serverless function instances.
//
// Token format: base64(payload) + "." + base64(hmac-sha256)
// Secret is set via Vercel Environment Variable: TOKEN_SECRET
// Falls back to a hardcoded default for demo (fine for this app).

const crypto = require('crypto');

const SECRET = process.env.TOKEN_SECRET || 'cognifin-demo-secret-2026-xK9mP';

function sign(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig  = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return data + '.' + sig;
}

function verify(token) {
  try {
    if (!token) return null;
    const [data, sig] = token.split('.');
    if (!data || !sig) return null;
    const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
    // Constant-time compare
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

module.exports = { sign, verify };
