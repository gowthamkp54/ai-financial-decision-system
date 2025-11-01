const { USERS } = require('../_db');
const { setCors, handleOptions, getUser } = require('../_cors');

const SYSTEM_PROMPT = `You are Cognifin, a superintelligent AI-native financial strategist for Indian investors.
You are a closed-loop financial decision engine optimizing for lifetime capital efficiency.

RESPONSE FORMAT:
**Decision**
[1-2 decisive sentences]

**What Actually Makes This Expensive**
[The hidden cost]

**3 Outcomes**
Best Case: ...
Likely Case: ...
Failure Case: ...

**Verdict**
[Single direct instruction]

RULES: Never hedge. Be specific with ₹ amounts. Under 250 words. Indian context (XIRR, SIP, LTCG/STCG, direct vs regular funds).`;

function demoReply(text) {
  const t = text.toLowerCase();
  if (t.includes('exit')||t.includes('flagged')) return `**Decision**\nExit 3 of 4 flagged funds immediately. Keep Nippon Small Cap only if holding > 3 years (STCG risk).\n\n**What Actually Makes This Expensive**\n₹9.6K sitting in funds underperforming benchmark by 1.5–2.5%. Silent drag of ₹240–340/year.\n\n**3 Outcomes**\nBest Case: Switch to Nifty 500 index, gain 1.5–2% annual alpha\nLikely Case: Continued stagnation with compounding TER drag\nFailure Case: Hold through next down-cycle, exit at a loss after 18 months\n\n**Verdict**\nSwitch ₹9.6K → Groww Nifty 500 Index Direct.`;
  if (t.includes('rent')||t.includes('buy')||t.includes('house')) return `**Decision**\nDo not buy unless EMI/income < 35% and you hold 18 months expenses liquid after the down payment.\n\n**What Actually Makes This Expensive**\nLocking ₹20–50L in an illiquid asset kills your ability to capture the next equity market opportunity.\n\n**3 Outcomes**\nBest Case: Buy at fair value, 6–8% appreciation\nLikely Case: EMI + opportunity cost exceeds rent savings for 7–10 years\nFailure Case: Income shock → distress sale at 15–20% discount\n\n**Verdict**\nRent until EMI/income < 35% AND 18-month liquid buffer exists. Then buy.`;
  if (t.includes('loan')) return `**Decision**\nPersonal loans at 14–18% almost never make sense unless the use case returns above that rate.\n\n**What Actually Makes This Expensive**\nA ₹5L loan at 16% over 3 years costs ₹1.3L in interest.\n\n**3 Outcomes**\nBest Case: Capital redeployed at 20%+, net positive\nLikely Case: Loan funds consumption — net wealth destruction of ₹1.3L\nFailure Case: EMI stress, credit score damage\n\n**Verdict**\nLiquidate underperforming mutual funds instead of borrowing.`;
  return `**Decision**\nActivate your free Gemini API key for a personalized verdict on this exact question.\n\n**What Actually Makes This Expensive**\nMost financial mistakes come from incomplete analysis — not wrong instincts.\n\n**3 Outcomes**\nBest Case: Gemini AI delivers a precise, data-driven verdict\nLikely Case: Demo mode gives directional guidance but misses your specific numbers\nFailure Case: Decision made without the full 6-axis tradeoff model\n\n**Verdict**\nGet your free key at aistudio.google.com/apikey → save in Profile page.`;
}

module.exports = async (req, res) => {
  setCors(res); if (handleOptions(req,res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });
  const user = getUser(req); if (!user) return res.status(401).json({ error:'Not authenticated' });
  const { message, history } = req.body || {};
  if (!message) return res.status(400).json({ error:'Message required' });
  const dbUser = USERS[user.username];
  const apiKey = dbUser.geminiKey;
  if (!apiKey) {
    const reply = demoReply(message);
    dbUser.chatHistory = dbUser.chatHistory || [];
    dbUser.chatHistory.unshift({ id:`ch_${Date.now()}`, timestamp:new Date().toISOString(), question:message.slice(0,100), answer:reply });
    if (dbUser.chatHistory.length > 30) dbUser.chatHistory = dbUser.chatHistory.slice(0,30);
    return res.json({ reply, isDemo:true });
  }
  try {
    const fetch = (await import('node-fetch')).default;
    const contents = [...(history||[]).slice(-8).map(h=>({ role:h.role==='assistant'?'model':'user', parts:[{text:h.content}] })), { role:'user', parts:[{text:message}] }];
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ system_instruction:{parts:[{text:SYSTEM_PROMPT}]}, contents, generationConfig:{maxOutputTokens:600,temperature:0.7} })
    });
    if (!r.ok) { const e = await r.json(); return res.status(400).json({ error:e.error?.message||'Gemini error' }); }
    const data = await r.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
    dbUser.chatHistory = dbUser.chatHistory || [];
    dbUser.chatHistory.unshift({ id:`ch_${Date.now()}`, timestamp:new Date().toISOString(), question:message.slice(0,100), answer:reply });
    if (dbUser.chatHistory.length > 30) dbUser.chatHistory = dbUser.chatHistory.slice(0,30);
    res.json({ reply, isDemo:false });
  } catch(e) {
    res.status(500).json({ error:'Gemini error: '+e.message });
  }
};
