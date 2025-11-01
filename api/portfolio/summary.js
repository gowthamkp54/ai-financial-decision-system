const { USERS } = require('../_db');
const { setCors, handleOptions, getUser } = require('../_cors');
module.exports = (req, res) => {
  setCors(res); if (handleOptions(req,res)) return;
  const user = getUser(req); if (!user) return res.status(401).json({ error:'Not authenticated' });
  const p = USERS[user.username].portfolio;
  const mfTotal    = p.mutualFunds.reduce((a,f)=>a+f.value,0);
  const stockTotal = p.stocks.reduce((a,s)=>a+s.qty*s.cmp,0);
  const flagged    = p.mutualFunds.filter(f=>f.status==='flagged');
  const terAnnual  = p.mutualFunds.reduce((a,f)=>a+(f.value*f.ter/100),0);
  res.json({
    totalAssets: p.totalAssets,
    mfTotal:     Math.round(mfTotal),
    stockTotal:  Math.round(stockTotal),
    xirr:        p.xirr,
    benchmarkXIRR: p.benchmarkXIRR,
    alphaVsBenchmark: +(p.xirr - p.benchmarkXIRR).toFixed(2),
    flaggedFunds: flagged.length,
    terAnnual:   Math.round(terAnnual),
    lastUpdated: p.lastUpdated
  });
};
