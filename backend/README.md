# CrowdfundFix — AI Powered Bug Intelligence & Fix Prediction Engine (AIBFE)

A production-structured FastAPI backend for AI-driven bug analysis, bounty prediction, developer matchmaking, and fix verification.

## Quick Start

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The server starts at **http://localhost:8000**. Interactive API docs at **http://localhost:8000/docs**.

## Folder Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── dependencies.py       # Auth & role-based access dependencies
│   ├── core/
│   │   ├── config.py         # App settings (env vars, JWT config)
│   │   ├── database.py       # SQLAlchemy engine, session, Base
│   │   └── security.py       # JWT creation/validation, password hashing
│   ├── models/
│   │   └── models.py         # SQLAlchemy ORM models (User, Bug, Funding, etc.)
│   ├── schemas/
│   │   └── schemas.py        # Pydantic request/response schemas
│   ├── api/
│   │   └── routes/
│   │       ├── auth.py       # POST /auth/login, /auth/signup, GET /auth/me
│   │       ├── bugs.py       # CRUD /bugs
│   │       ├── ai.py         # POST /ai/analyze-bug, GET /ai/match-developers/{id}
│   │       ├── funding.py    # POST/GET /fund/{bug_id}
│   │       ├── verification.py  # POST /verify-fix
│   │       └── analytics.py  # GET /analytics/dashboard
│   ├── services/
│   │   ├── bug_service.py        # Bug business logic
│   │   ├── ai_service.py         # AI orchestration
│   │   ├── funding_service.py    # Funding logic
│   │   ├── analytics_service.py  # Dashboard aggregation
│   │   └── verification_service.py  # Simulated fix verification
│   ├── ai/
│   │   └── engine.py         # AI engine (TF-IDF, heuristic scoring, matching)
│   └── utils/
│       └── seed.py           # Mock data loader (runs at startup)
├── mock_data/                # (optional) local mock JSON files
├── tests/
│   └── test_api.py           # pytest tests
├── requirements.txt
├── pytest.ini
└── README.md
```

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth (Mock JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login with email/password |
| GET | `/auth/me` | Get current user (requires Bearer token) |

### Bugs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bugs` | Create a new bug (auth required) |
| GET | `/bugs` | List all bugs |
| GET | `/bugs/{id}` | Get bug by ID |
| PATCH | `/bugs/{id}/status` | Update bug status (auth required) |

### AI Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/analyze-bug` | Run AI analysis pipeline on a bug |
| GET | `/ai/match-developers/{bug_id}` | Get developer matches for a bug |

### Funding
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/fund/{bug_id}` | Fund a bug |
| GET | `/fund/{bug_id}` | Get funding details for a bug |

### Fix Verification
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/verify-fix` | Simulate PR fix verification |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/dashboard` | Get aggregated dashboard stats |

## Example Requests

### Sign Up
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com", "password": "pass123", "role": "User"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "password123"}'
```

### Submit a Bug
```bash
curl -X POST http://localhost:8000/api/v1/bugs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Login redirect loop",
    "description": "JWT refresh causes infinite redirect",
    "repoLink": "https://github.com/org/repo",
    "tags": ["auth", "jwt"],
    "severity": "Critical"
  }'
```

### AI Analysis
```bash
curl -X POST http://localhost:8000/api/v1/ai/analyze-bug \
  -H "Content-Type: application/json" \
  -d '{"bugId": "bug-1"}'
```

### Match Developers
```bash
curl http://localhost:8000/api/v1/ai/match-developers/bug-1
```

### Fund a Bug
```bash
curl -X POST http://localhost:8000/api/v1/fund/bug-1 \
  -H "Content-Type: application/json" \
  -d '{"contributor_name": "Alice", "amount": 50}'
```

### Verify Fix
```bash
curl -X POST http://localhost:8000/api/v1/verify-fix \
  -H "Content-Type: application/json" \
  -d '{"bugId": "bug-1", "developerId": "dev-1", "prLink": "https://github.com/org/repo/pull/42"}'
```

### Dashboard Analytics
```bash
curl http://localhost:8000/api/v1/analytics/dashboard
```

## Running Tests

```bash
cd backend
pytest -v
```

## Default Credentials

All seeded users share the password: `password123`

| Email | Role |
|-------|------|
| admin@crowdfundfix.io | Admin |
| alice@example.com | User |
| bob@example.com | User |
| carol@example.com | User |
| sarah.chen@dev.io | Developer |
| alex.rodriguez@dev.io | Developer |
| david.kim@dev.io | Developer |
| elena.smith@dev.io | Developer |

## Technology Stack

- **FastAPI** — High-performance async web framework
- **SQLAlchemy** — ORM with SQLite (PostgreSQL-ready)
- **Pydantic** — Data validation and serialization
- **python-jose** — JWT token handling
- **scikit-learn** — ML clustering and analysis
- **passlib + bcrypt** — Password hashing

All dependencies are **free and open source**. No paid APIs required.
