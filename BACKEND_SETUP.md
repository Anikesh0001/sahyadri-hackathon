🧠 ROLE

You are a Senior Backend Architect building the backend for an AI SaaS platform.

You must generate a complete, production-structured FastAPI backend for:

CrowdfundFix — AI Powered Bug Intelligence & Fix Prediction Engine (AIBFE)

The frontend already exists using Next.js.

Your backend must integrate seamlessly with frontend API calls.

⚠️ GLOBAL REQUIREMENTS
MUST BE FREE ONLY

Allowed:

Python

FastAPI

SQLite (default)

PostgreSQL optional

HuggingFace free models

Local ML simulation

Docker (optional)

GitHub API (public endpoints only)

NOT allowed:

Paid APIs

OpenAI paid usage

Firebase paid plans

External billing services

System must run locally.

🏗️ BACKEND ARCHITECTURE

Create folder:

/backend

Structure:

backend/
 ├── app/
 │   ├── main.py
 │   ├── core/
 │   │    config.py
 │   │    database.py
 │   │    security.py
 │   ├── models/
 │   ├── schemas/
 │   ├── api/
 │   │    routes/
 │   ├── services/
 │   ├── ai/
 │   ├── utils/
 │   └── dependencies.py
 ├── mock_data/
 ├── tests/
 ├── requirements.txt
 └── README.md

Follow clean architecture.

🧩 CORE DOMAIN MODELS

Create SQLAlchemy models:

User

id

name

email

role (USER | DEVELOPER | ADMIN)

reputation

created_at

Bug

id

title

description

repo_link

severity

status

ai_priority_score

predicted_complexity

predicted_bounty

created_by

created_at

Funding

id

bug_id

contributor_name

amount

DeveloperMatch

id

bug_id

developer_id

match_score

FixSubmission

id

bug_id

developer_id

pr_link

verification_score

status

🗄 DATABASE

Use:

SQLite (default)
SQLAlchemy ORM
Alembic-ready structure

Auto-create tables at startup.

🔌 API ENDPOINTS (MUST MATCH FRONTEND)

Prefix:

/api/v1
AUTH (Mock JWT)
POST /auth/login
POST /auth/signup
GET /auth/me

Use simple JWT with free python library.

BUG APIs
POST   /bugs
GET    /bugs
GET    /bugs/{id}
PATCH  /bugs/{id}/status
AI ANALYSIS (CORE FEATURE)

When bug is submitted:

Trigger AI pipeline:

POST /ai/analyze-bug

Return:

{
 summary,
 category,
 complexity_score,
 predicted_bounty,
 impact_score,
 priority_score,
 error_clusters
}
AI IMPLEMENTATION (FREE)

Create simulated AI engine inside:

app/ai/engine.py

Use:

sentence-transformers (free)

sklearn clustering

heuristic scoring

If models unavailable → fallback mock logic.

DEVELOPER MATCHING
GET /ai/match-developers/{bug_id}

Algorithm:

Compare bug tags vs developer skills

Reputation weighting

Random variation

Return match %.

FUNDING
POST /fund/{bug_id}
GET  /fund/{bug_id}

Update funding totals.

FIX VERIFICATION (SIMULATED)
POST /verify-fix

Logic:

simulate PR diff score

similarity %

pass/fail result

ANALYTICS
GET /analytics/dashboard

Return aggregated stats:

total bugs

resolved %

funding distribution

developer rankings

🧠 SERVICES LAYER

Create service classes:

bug_service.py
ai_service.py
funding_service.py
analytics_service.py
verification_service.py

Routes must NOT contain business logic.

🔄 MOCK DATA LOADER

At startup:

load mock bugs

load developers

generate AI baseline data

🔐 SECURITY

Implement:

JWT auth dependency

Role-based access decorator

Example:

@require_role("ADMIN")
⚡ PERFORMANCE

Add:

async endpoints

dependency injection

response models (Pydantic)

🌐 CORS

Allow:

http://localhost:3000

for Next.js frontend.

🧪 TESTING

Create minimal pytest tests:

auth

bug creation

AI analysis

📦 REQUIREMENTS.TXT

Include only free libraries:

fastapi
uvicorn
sqlalchemy
pydantic
python-jose
passlib
sentence-transformers
scikit-learn
numpy
pytest
▶️ RUNNING REQUIREMENTS

Backend must run with:

pip install -r requirements.txt
uvicorn app.main:app --reload

NO ERRORS ALLOWED.

📘 README

Generate README including:

setup

folder explanation

API docs

example requests

⭐ FINAL EXPECTATION

After generation:

Frontend calls like:

await api.submitBug()
await api.getRecommendations()

must work immediately.

The system must demonstrate:

AI bug intelligence

bounty prediction

developer matchmaking

verification simulation

analytics dashboard

without external services.