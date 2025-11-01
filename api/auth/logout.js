// api/auth/logout.js — tokens are stateless, just return success
const { setCors, handleOptions } = require('../_cors');
module.exports = (req, res) => {
  setCors(res);
  if (handleOptions(req, res)) return;
  res.json({ success: true });
};
