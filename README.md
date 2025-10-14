# COGNIFIN — Vercel Deployment Guide

## Deploy in 3 Steps

### Step 1 — Push to GitHub

```bash
# In the cognifin-vercel folder:
git init
git add .
git commit -m "Cognifin initial deploy"

# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/cognifin.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to **vercel.com** → Sign up / Log in with GitHub
2. Click **"Add New Project"**
3. Import your `cognifin` GitHub repo
4. Vercel auto-detects the settings — click **"Deploy"**
5. Done! Your site is live at `https://cognifin-xxx.vercel.app`

### Step 3 — Test it

Open your Vercel URL. Use these demo accounts:

| Username   | Password     |
|------------|--------------|
| `user123`  | `Pass@123`   |
| `priya_k`  | `Invest2024` |
| `arjun_s`  | `Finance#99` |

---

## Project Structure

```
cognifin-vercel/
├── vercel.json          ← Routing config (pages + API)
├── package.json         ← Node deps (uuid, node-fetch)
├── api/                 ← Serverless functions
│   ├── _db.js           ← Shared in-memory database
│   ├── _cors.js         ← CORS + auth helpers
│   ├── auth/
│   │   ├── login.js     → POST /api/auth/login
│   │   ├── logout.js    → POST /api/auth/logout
│   │   └── me.js        → GET /api/auth/me
│   ├── portfolio/
│   │   ├── index.js     → GET /api/portfolio
│   │   ├── summary.js   → GET /api/portfolio/summary
│   │   ├── goals.js     → GET /api/portfolio/goals
│   │   └── gemini-key.js→ GET/PUT /api/portfolio/gemini-key
│   ├── chat/
│   │   ├── send.js      → POST /api/chat/send
│   │   └── history.js   → GET/DELETE /api/chat/history
│   └── user/
│       ├── profile.js   → GET/PUT /api/user/profile
│       └── insights.js  → GET /api/user/insights
└── public/              ← Static frontend files
    ├── index.html       ← Landing page
    ├── pages/
    │   ├── login.html
    │   ├── dashboard.html
    │   ├── portfolio.html
    │   ├── chat.html
    │   ├── goals.html
    │   └── profile.html
    └── assets/
        ├── css/shared.css
        └── js/shared.js
```

---

## Important Note

### Memory / Sessions
Vercel serverless functions are **stateless** — each function invocation may hit a fresh instance. Sessions and user data (including Gemini keys) persist within the same **warm function instance** using `global._cf_sessions`. 

For a production app, replace `_db.js` with a real database:
- **Vercel KV** (Redis) — easiest, built into Vercel
- **Supabase** — free Postgres
- **PlanetScale** — free MySQL

### Gemini API Key
Users enter their own free Gemini key via the Profile page. Get one at:
https://aistudio.google.com/apikey (free, no credit card)

### Custom Domain
In Vercel dashboard → Settings → Domains → Add your domain.

---

## Local Development

```bash
npm install -g vercel
vercel dev
# Opens at http://localhost:3000
```
