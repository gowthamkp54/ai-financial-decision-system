const { USERS } = require('../_db');
const { setCors, handleOptions, getUser } = require('../_cors');
module.exports = (req, res) => {
  setCors(res); if (handleOptions(req,res)) return;
  const user = getUser(req); if (!user) return res.status(401).json({ error:'Not authenticated' });
  const u = USERS[user.username];
  if (req.method === 'GET') {
    const { password, geminiKey, chatHistory, portfolio, ...safe } = u;
    return res.json({ ...safe, hasGeminiKey: !!geminiKey });
  }
  if (req.method === 'PUT') {
    ['name','email','phone','city'].forEach(k => { if (req.body?.[k]) u[k] = req.body[k]; });
    return res.json({ success:true });
  }
  res.status(405).json({ error:'Method not allowed' });
};
