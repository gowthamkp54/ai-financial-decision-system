const { USERS } = require('../_db');
const { setCors, handleOptions, getUser } = require('../_cors');
module.exports = (req, res) => {
  setCors(res); if (handleOptions(req,res)) return;
  const user = getUser(req); if (!user) return res.status(401).json({ error:'Not authenticated' });
  const p = USERS[user.username].portfolio;
  const insights = [];
  const flagged = p.mutualFunds.filter(f=>f.status==='flagged');
  if (flagged.length > 0) {
    const v = flagged.reduce((a,f)=>a+f.value,0);
    insights.push({ type:'warning', icon:'⚠', title:`${flagged.length} funds flagged for poor performance`, body:`₹${v.toLocaleString('en-IN')} in funds with negative XIRR. Annual TER drag: ₹${Math.round(flagged.reduce((a,f)=>a+f.value*f.ter/100,0))}.`, action:'Review in Portfolio' });
  }
  const reg = p.mutualFunds.filter(f=>f.name.toLowerCase().includes('regular'));
  if (reg.length > 0) insights.push({ type:'warning', icon:'💸', title:`${reg.length} regular plan fund(s) detected`, body:`Regular plans cost 0.5–1.5% more TER than direct. ₹${Math.round(reg.reduce((a,f)=>a+f.value*0.01,0))}/yr avoidable.`, action:'Switch to Direct' });
  if (p.xirr > p.benchmarkXIRR) insights.push({ type:'success', icon:'✦', title:`Portfolio generating +${(p.xirr-p.benchmarkXIRR).toFixed(2)}% alpha`, body:`XIRR ${p.xirr}% beats benchmark by ${(p.xirr-p.benchmarkXIRR).toFixed(2)}%.`, action:null });
  res.json(insights);
};
