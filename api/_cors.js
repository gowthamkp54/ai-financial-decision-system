// api/_cors.js
const { verify } = require('./_token');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-session-id');
}

function handleOptions(req, res) {
  if (req.method === 'OPTIONS') { setCors(res); res.status(200).end(); return true; }
  return false;
}

// Reads token from x-session-id header, verifies it, returns user payload
function getUser(req) {
  const token = req.headers['x-session-id'];
  if (!token) return null;
  return verify(token); // returns { id, username, name, plan, exp } or null
}

module.exports = { setCors, handleOptions, getUser };
