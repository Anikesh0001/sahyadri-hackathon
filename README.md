# CrowdfundFix — AI Powered Bug Intelligence & Fix Prediction Engine

> Fund the Fixes. Power the Builders.

CrowdfundFix is a platform where users post software bugs as bounty tasks, the community crowdfunds fixes, and AI matches the right developers to solve them.

Built for hackathons. Runs 100% free. No paid APIs.

---

## What It Does

- **Submit Bugs** — Anyone can report a bug with logs, repo link, and severity
- **AI Analysis** — Our AI engine auto-categorizes bugs, predicts complexity, estimates bounty, and extracts error patterns
- **Crowdfund Fixes** — Community members fund bug bounties so developers get paid
- **Developer Matching** — AI scores and ranks developers based on skill overlap, reputation, and experience
- **Fix Verification** — Simulated PR diff analysis to verify if a submitted fix actually solves the bug
- **Analytics Dashboard** — Live stats on bugs, funding, severity breakdown, and top developers

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, React 19, Tailwind CSS, Framer Motion, Zustand, Recharts |
| Backend | FastAPI, SQLAlchemy, Pydantic, scikit-learn |
| Database | SQLite (zero setup) |
| Auth | JWT (python-jose + bcrypt) |
| AI | Heuristic scoring, TF-IDF ready, keyword clustering |
| Deploy | Vercel (frontend) + Render (backend) — both free tier |

---

## Pages

| Route | What it does |
|-------|-------------|
| `/` | Landing page |
| `/bugs` | Browse all bugs with status, severity, and AI scores |
| `/bugs/[id]` | Bug detail — AI analysis, developer matches, funding |
| `/submit` | Submit a new bug report |
| `/dashboard` | Role-based dashboard (User / Developer / Admin) |
| `/analytics` | Charts and stats across the platform |
| `/workflow` | Visual pipeline of how CrowdfundFix works |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/crowdfundfix.git
cd crowdfundfix
npm install
```

### 2. Start the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at **http://localhost:8000** — Swagger docs at **/docs**

### 3. Start the frontend

```bash
# In project root
npm run dev
```

Frontend runs at **http://localhost:3000**

### 4. Or run both at once

```bash
npm run dev:full
```

---

## API Highlights

All endpoints at `/api/v1`:

```
POST /auth/signup          — Create account
POST /auth/login           — Get JWT token
GET  /bugs                 — List all bugs
POST /bugs                 — Submit a bug (auth required)
POST /ai/analyze-bug       — AI analysis pipeline
GET  /ai/match-developers/:id — Developer matching
POST /fund/:bug_id         — Fund a bug
POST /verify-fix           — Simulate fix verification
GET  /analytics/dashboard  — Platform-wide stats
```

---

## Default Test Accounts

Password for all: `password123`

| Email | Role |
|-------|------|
| admin@crowdfundfix.io | Admin |
| alice@example.com | User |
| sarah.chen@dev.io | Developer |
| alex.rodriguez@dev.io | Developer |

---

## Deploy

- **Frontend** → Push to GitHub, import in [Vercel](https://vercel.com), set `NEXT_PUBLIC_API_URL`
- **Backend** → Connect repo on [Render](https://render.com), root dir `backend`, start command `bash start.sh`

Full guide in [DEPLOY.md](DEPLOY.md).

---

## Project Structure

```
├── app/                  # Next.js pages (bugs, dashboard, analytics, etc.)
├── components/           # UI components (Navbar, Footer, theme, shadcn/ui)
├── features/             # Feature modules (AI panels, bug submission, dashboards)
├── services/api.ts       # API client — hits backend, falls back to mock data
├── store/                # Zustand stores (auth, bugs)
├── types/                # TypeScript interfaces
├── mock/                 # Mock JSON data
├── backend/
│   ├── app/main.py       # FastAPI entry point
│   ├── app/ai/engine.py  # AI engine (categorization, scoring, matching)
│   ├── app/api/routes/   # All API endpoints
│   ├── app/services/     # Business logic layer
│   ├── app/models/       # SQLAlchemy ORM models
│   └── app/schemas/      # Pydantic request/response schemas
└── DEPLOY.md             # Deployment guide
```

---

## Team

Built with caffeine and ambition.

---

## License

MIT
