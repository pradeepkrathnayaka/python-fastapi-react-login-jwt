# FastAPI JWT Auth Backend

A production-ready FastAPI backend with JWT authentication, SQLAlchemy ORM, Alembic migrations, and a clean layered architecture.

## Features

- **JWT Authentication** – access + refresh token flow
- **User Management** – register, login, CRUD, role-based access
- **SQLAlchemy 2.0** ORM with Alembic migrations
- **Repository + Service** pattern for clean separation of concerns
- **Rate Limiting** via `slowapi`
- **CORS** configured for React frontend
- **Structured Logging** to stdout and file
- **Docker** ready

## Quick Start

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements-dev.txt

# 3. Copy env file
cp .env.example .env.development

# 4. Run the server
uvicorn src.main:app --reload --env-file .env.development
```

The API will be available at http://localhost:8000  
Interactive docs: http://localhost:8000/docs

## Project Structure

```
backend/
├── src/
│   ├── api/v1/endpoints/   # Route handlers
│   ├── core/               # Config, security, exceptions, logging
│   ├── db/                 # Session, base, init
│   ├── models/             # SQLAlchemy ORM models
│   ├── schemas/            # Pydantic request/response schemas
│   ├── services/           # Business logic
│   ├── repositories/       # Data access layer
│   ├── middleware/         # CORS, logging, rate limiting
│   └── utils/              # Helpers, validators, email
├── alembic/                # Database migrations
├── tests/                  # Unit, integration, e2e tests
└── scripts/                # Utility scripts
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | OAuth2 form login → tokens |
| POST | `/api/v1/auth/login/json` | JSON body login → tokens |
| POST | `/api/v1/auth/register` | Create new user |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| GET  | `/api/v1/auth/me` | Current user info |
| GET  | `/api/v1/users/` | List users (superuser) |
| GET  | `/api/v1/users/{id}` | Get user by id |
| PUT  | `/api/v1/users/{id}` | Update user |
| DELETE | `/api/v1/users/{id}` | Delete user (superuser) |
| GET  | `/api/v1/health/` | Health check |
| GET  | `/api/v1/health/db` | DB connectivity check |

## Running Tests

```bash
pytest
# or with coverage
pytest --cov=src --cov-report=html
```

## Docker

```bash
docker-compose up --build
```

## Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Downgrade
alembic downgrade -1
```
