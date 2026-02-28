ROLE

You are a Senior DevOps + Backend + Frontend Deployment Engineer.

Your task is to prepare the existing project CrowdfundFix (Next.js + FastAPI) for FREE production deployment.

The project already works locally.
Your job is ONLY to make it production deployable without breaking functionality.

🎯 DEPLOYMENT TARGETS

Frontend → Vercel (Free)
Backend → Render Web Service (Free)
Database → SQLite (initial deployment)

No paid services allowed.

⚠️ GLOBAL RULES

Do NOT change application logic.

Do NOT remove existing APIs.

Only add deployment-safe configs.

Ensure zero runtime errors.

Everything must run via environment variables.

🧩 PART 1 — BACKEND DEPLOYMENT PREPARATION

Backend folder:

/backend
1. Create production entry support

Ensure FastAPI runs correctly on Render.

Create:

backend/start.sh
#!/usr/bin/env bash
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}

Make executable.

2. Update main.py

Add:

Health check endpoint
@app.get("/")
async def health():
    return {"status": "CrowdfundFix API running"}
3. Fix CORS for production

Update CORS middleware:

Allow:

http://localhost:3000
https://*.vercel.app

Also allow credentials, headers, and methods.

4. Environment Configuration

Create:

backend/.env.example

Include:

SECRET_KEY=changeme
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT=production

Update config loader to read env vars safely.

5. Requirements Stabilization

Ensure requirements.txt contains ONLY required packages.

Remove duplicates.

6. Render Deployment Config

Create:

backend/render.yaml
services:
  - type: web
    name: crowdfundfix-backend
    env: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: bash start.sh
    autoDeploy: true
7. SQLite Safety

Ensure database path:

./app.db

and auto-create tables on startup.

🧩 PART 2 — FRONTEND DEPLOYMENT PREPARATION

Frontend root = project root.

1. Environment Variable Support

Create:

.env.example
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
2. Update API Service

Modify /services/api.ts:

Replace hardcoded URLs with:

const API_BASE =
 process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
3. Production Build Safety

Update next.config.js:

Add:

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  }
};

module.exports = nextConfig;
4. Add Vercel Config

Create:

vercel.json
{
  "framework": "nextjs"
}
🧩 PART 3 — DEV EXPERIENCE IMPROVEMENTS

Create scripts:

root package.json

Add:

"scripts": {
  "dev:full": "concurrently \"npm run dev\" \"cd backend && uvicorn app.main:app --reload\""
}

Install concurrently if missing.

🧩 PART 4 — DEPLOYMENT DOCUMENTATION

Create:

DEPLOY.md

Include:

Backend deployment steps (Render)

Frontend deployment steps (Vercel)

Environment variables setup

Troubleshooting guide

🧩 PART 5 — FINAL VALIDATION CHECK

Ensure project runs:

Backend:

uvicorn app.main:app --reload

Frontend:

npm run dev

No warnings or runtime failures allowed.

🧩 PART 6 — OPTIONAL (IF SAFE)

Add lightweight logging middleware.

✅ FINAL OUTPUT

After implementation:

Project must be deployable with:

Git push → auto deploy

No manual code edits required

Swagger docs accessible online

Frontend connects automatically via env variable