# Gaming CRM

Internal CRM for BD/AM/MKT teams — exhibitions, contacts, companies, business trips, gift tracking.

## Deploy to Vercel (5 minutes)

### Option A — GitHub + Vercel (recommended)

1. **Create a GitHub repo**
   - Go to github.com → New repository → name it `gaming-crm` → Create
   - Upload all these files (drag & drop into the repo, or use GitHub Desktop)

2. **Deploy on Vercel**
   - Go to vercel.com → Sign up with GitHub (free)
   - Click **Add New Project** → Import your `gaming-crm` repo
   - Framework preset: **Vite** (auto-detected)
   - Click **Deploy**
   - Done — you get a URL like `gaming-crm.vercel.app`

### Option B — Vercel CLI (fastest)

```bash
npm install -g vercel
cd crm-app
npm install
vercel
```
Follow the prompts — it will give you a live URL instantly.

## Run locally

```bash
npm install
npm run dev
```
Opens at http://localhost:5173

## Data & sharing

Data is stored in each browser's **localStorage** — each person starts with the full seed data.

**To share updates across the team:**
1. One person maintains the master copy
2. Go to sidebar → **Export All Data** → share the `.json` file via Slack/Drive
3. Team members go to sidebar → **Import Data** → select the file

## Tech stack
- React 18
- Vite
- Tailwind CSS
- Lucide React icons
- localStorage (no backend needed)
