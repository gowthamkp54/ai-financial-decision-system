const { USERS } = require('../_db');
const { setCors, handleOptions, getUser } = require('../_cors');
// NOTE: On Vercel, geminiKey is stored in module-level USERS object.
// It persists within warm instances. For true persistence use Vercel KV.
module.exports = (req, res) => {
  setCors(res); if (handleOptions(req,res)) return;
  const user = getUser(req); if (!user) return res.status(401).json({ error:'Not authenticated' });
  if (req.method === 'PUT') {
    const { key } = req.body || {};
    if (!key || !key.startsWith('AIza')) return res.status(400).json({ error:'Invalid Gemini API key' });
    USERS[user.username].geminiKey = key;
    return res.json({ success:true });
  }
  if (req.method === 'GET') {
    const k = USERS[user.username].geminiKey;
    return res.json({ hasKey:!!k, maskedKey: k ? 'AIza...'+k.slice(-4) : null });
  }
  res.status(405).json({ error:'Method not allowed' });
};
