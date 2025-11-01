const { USERS } = require('../_db');
const { setCors, handleOptions, getUser } = require('../_cors');
module.exports = (req, res) => {
  setCors(res); if (handleOptions(req,res)) return;
  const user = getUser(req); if (!user) return res.status(401).json({ error:'Not authenticated' });
  const u = USERS[user.username];
  if (req.method === 'GET')    return res.json(u.chatHistory || []);
  if (req.method === 'DELETE') { u.chatHistory = []; return res.json({ success:true }); }
  res.status(405).json({ error:'Method not allowed' });
};
