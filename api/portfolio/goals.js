const { USERS } = require('../_db');
const { setCors, handleOptions, getUser } = require('../_cors');
module.exports = (req, res) => {
  setCors(res); if (handleOptions(req,res)) return;
  const user = getUser(req); if (!user) return res.status(401).json({ error:'Not authenticated' });
  res.json(USERS[user.username].portfolio.goals);
};
