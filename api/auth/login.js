// api/auth/login.js
const { USERS } = require('../_db');
const { sign }  = require('../_token');
const { setCors, handleOptions } = require('../_cors');

module.exports = (req, res) => {
  setCors(res);
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  const user = USERS[username.toLowerCase()];
  if (!user || user.password !== password)
    return res.status(401).json({ error: 'Invalid username or password' });

  // Create a self-contained signed token valid for 24 hours
  const payload = {
    id:       user.id,
    username: user.username,
    name:     user.name,
    plan:     user.plan,
    exp:      Date.now() + 86400000   // 24h
  };
  const token = sign(payload);

  res.json({ success: true, sessionId: token, user: payload });
};
