// api/_db.js — User data (stateless-safe: no sessions stored here)
// Passwords are plain strings — compared directly, no bcrypt
// This avoids the "breached password" warning from Google/browsers

const USERS = {
  user123: {
    id: "usr_001",
    username: "user123",
    password: "Cognifin@2026",   // ← changed from Pass@123
    name: "Rohit Mehta",
    email: "rohit.mehta@example.com",
    phone: "+91-9876543210",
    city: "Bangalore",
    joinedAt: "2024-01-15",
    plan: "starter",
    geminiKey: "",
    chatHistory: [],
    portfolio: {
      totalAssets: 249980,
      xirr: 8.06,
      benchmarkXIRR: 3.46,
      lastUpdated: "2026-03-08",
      mutualFunds: [
        { name: "Axis US Specific Equity Passive",       value: 2891,  irr: 24.9, type: "US Equity",  status: "hold",        ter: 0.10 },
        { name: "Edelweiss US Technology Equity",        value: 2610,  irr: 18.7, type: "US Equity",  status: "hold",        ter: 0.55 },
        { name: "Mirae Asset Global X AI",               value: 1987,  irr: 15.2, type: "AI Tech",    status: "hold",        ter: 0.49 },
        { name: "Nippon India Small Cap Fund",           value: 3980,  irr: 12.4, type: "Small Cap",  status: "review",      ter: 1.57 },
        { name: "Kotak Gold Fund",                       value: 627,   irr: 61.4, type: "Gold",       status: "underweight", ter: 0.29 },
        { name: "UTI Nifty200 Momentum 30",              value: 2110,  irr: -3.2, type: "Factor",     status: "flagged",     ter: 0.30 },
        { name: "SBI Bluechip Fund Regular",             value: 4200,  irr: -1.8, type: "Large Cap",  status: "flagged",     ter: 1.63 },
        { name: "HDFC Balanced Advantage Regular",       value: 3810,  irr: -0.9, type: "Hybrid",     status: "flagged",     ter: 1.72 },
        { name: "Aditya Birla SL Frontline Equity Reg",  value: 3006,  irr: -2.1, type: "Large Cap",  status: "flagged",     ter: 1.68 }
      ],
      stocks: [
        { name: "Reliance Industries", qty: 5,  avgBuy: 2340, cmp: 2480, sector: "Energy"  },
        { name: "Infosys",             qty: 10, avgBuy: 1450, cmp: 1521, sector: "IT"      },
        { name: "HDFC Bank",           qty: 8,  avgBuy: 1680, cmp: 1590, sector: "Banking" },
        { name: "Tata Motors",         qty: 20, avgBuy: 780,  cmp: 812,  sector: "Auto"    }
      ],
      goals: [
        { name: "Emergency Fund",     target: 150000,   current: 80000,  deadline: "2026-12-01" },
        { name: "Europe Trip",        target: 200000,   current: 35000,  deadline: "2027-06-01" },
        { name: "House Down Payment", target: 1500000,  current: 49980,  deadline: "2030-01-01" }
      ]
    }
  },

  priya_k: {
    id: "usr_002",
    username: "priya_k",
    password: "Cognifin@2026",   // ← changed from Invest2024
    name: "Priya Krishnamurthy",
    email: "priya.k@example.com",
    phone: "+91-9123456789",
    city: "Mumbai",
    joinedAt: "2024-03-20",
    plan: "autopilot",
    geminiKey: "",
    chatHistory: [],
    portfolio: {
      totalAssets: 2182500,
      xirr: 11.4,
      benchmarkXIRR: 3.46,
      lastUpdated: "2026-03-08",
      mutualFunds: [
        { name: "Parag Parikh Flexi Cap Direct",   value: 620000, irr: 16.2, type: "Flexi Cap",  status: "hold",    ter: 0.63 },
        { name: "Axis Midcap Direct",              value: 385000, irr: 13.7, type: "Mid Cap",    status: "hold",    ter: 0.53 },
        { name: "Mirae Asset Large Cap Direct",    value: 310000, irr: 9.8,  type: "Large Cap",  status: "hold",    ter: 0.54 },
        { name: "Quant Small Cap Direct",          value: 210000, irr: 22.1, type: "Small Cap",  status: "hold",    ter: 0.64 },
        { name: "ICICI Pru US Bluechip Regular",   value: 185000, irr: 5.2,  type: "US Equity",  status: "flagged", ter: 2.10 },
        { name: "SBI Gold Regular",                value: 115000, irr: 14.3, type: "Gold",       status: "review",  ter: 0.50 }
      ],
      stocks: [
        { name: "TCS",         qty: 5,  avgBuy: 3600, cmp: 3850, sector: "IT"   },
        { name: "Asian Paints",qty: 10, avgBuy: 2900, cmp: 2730, sector: "FMCG" }
      ],
      goals: [
        { name: "Retirement Corpus", target: 10000000, current: 2182500, deadline: "2045-01-01" },
        { name: "Child Education",   target: 2000000,  current: 500000,  deadline: "2035-06-01" }
      ]
    }
  },

  arjun_s: {
    id: "usr_003",
    username: "arjun_s",
    password: "Cognifin@2026",   // ← changed from Finance#99
    name: "Arjun Sharma",
    email: "arjun.s@example.com",
    phone: "+91-9845671230",
    city: "Hyderabad",
    joinedAt: "2025-01-10",
    plan: "starter",
    geminiKey: "",
    chatHistory: [],
    portfolio: {
      totalAssets: 28750,
      xirr: 6.2,
      benchmarkXIRR: 3.46,
      lastUpdated: "2026-03-08",
      mutualFunds: [
        { name: "Nifty 500 Index Direct",        value: 12000, irr: 9.4, type: "Index", status: "hold", ter: 0.10 },
        { name: "Zerodha Nifty LargeMidcap 250", value: 8750,  irr: 7.8, type: "Index", status: "hold", ter: 0.10 },
        { name: "UTI Nifty50 Index Direct",      value: 8000,  irr: 8.1, type: "Index", status: "hold", ter: 0.06 }
      ],
      stocks: [],
      goals: [
        { name: "Startup Emergency Fund", target: 500000, current: 28750, deadline: "2027-01-01" }
      ]
    }
  }
};

module.exports = { USERS };
