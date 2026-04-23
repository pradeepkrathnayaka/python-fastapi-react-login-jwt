
## ✨ Features

- 🔑 **JWT Authentication** - Secure token-based authentication
- 🔄 **Refresh Tokens** - Automatic token renewal without re-login
- 🍪 **Cookie Management** - HttpOnly cookies for enhanced security
- ⚡ **FastAPI Backend** - High-performance async Python framework
- ⚛️ **React Frontend** - Modern UI with TypeScript support
- 🎨 **Vite Build Tool** - Lightning-fast development experience

## 🛠️ Tech Stack

### Backend
- **FastAPI** `0.112.2` - Modern web framework
- **Uvicorn** `0.30.6` - ASGI server
- **PyJWT** `2.9.0` - JWT token handling
- **Pytest** `8.3.2` - Testing framework

### Frontend
- **React** `19.2.5` - UI library
- **TypeScript** `5.8.3` - Type safety
- **Vite** `8.0.9` - Build tool & dev server
- **Axios** `1.15.2` - HTTP client

## 📋 Prerequisites

Before getting started, ensure you have knowledge of:

- ✅ HTML
- ✅ CSS  
- ✅ JavaScript
- ✅ TypeScript

### Required Software

| Tool | Version Check | Download |
|------|---------------|----------|
| **Node.js** | `node -v` | [nodejs.org](https://nodejs.org/en/download) |
| **Python** | `python --version` | [python.org](https://www.python.org/downloads/) |

## 🚀 Getting Started

### 1️⃣ Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn src.main:app --reload