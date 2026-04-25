# Python FastAPI + React JWT Authentication

A comprehensive authentication system featuring a **FastAPI** backend and **React** (Vite + TypeScript) frontend. This project demonstrates secure user authentication using **JSON Web Tokens (JWT)** with both access and refresh tokens, persisted via secure HttpOnly cookies.

## ✨ Features

- **JWT Authentication**: Secure token-based flow with industry standards.
- **Refresh Token Pattern**: Automatic token renewal for seamless user experience.
- **Cookie-Based Security**: HttpOnly cookies to mitigate XSS attacks.
- **Role-Based Access Control**: Foundations for managing user permissions.
- **Production Ready**: Includes Docker Compose setup, Rate Limiting, and structured logging.
- **Full-Stack Type Safety**: Pydantic models in Python and TypeScript interfaces in React.

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, high-performance web framework.
- **SQLAlchemy + Alembic**: Database ORM and migrations.
- **PyJWT**: Secure JWT token generation and validation.
- **SlowAPI**: Rate limiting for API protection.
- **Pytest**: Robust testing suite (Unit, Integration, E2E).

### Frontend
- **React 19**: Modern UI library with Functional Components and Hooks.
- **TypeScript**: Static typing for fewer runtime errors.
- **Vite**: Ultra-fast build tool and development server.
- **Redux Toolkit**: State management for authentication and user data.
- **Axios**: Interceptor-powered HTTP client for token management.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose (optional for local DB)

### 1️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn src.main:app --reload
```

### 2️⃣ Frontend Setup
```bash
cd reactui
npm install
cp .env.example .env
npm run dev
```

## 🐳 Docker Deployment
Run the entire stack with a single command:
```bash
docker-compose up --build
```

## 📜 License
This project is licensed under the MIT License.
