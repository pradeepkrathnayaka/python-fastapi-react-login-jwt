from datetime import datetime, timedelta, timezone

import jwt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Constants
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy user data for demonstration purposes
fake_users_db = {
    "user1": {
        "username": "user1",
        "password": "password123",
    }
}


class LoginForm(BaseModel):
    username: str
    password: str


def verify_password(plain_password, hashed_password):
    # In a real application, use a proper password hashing library like bcrypt
    return plain_password == hashed_password


def get_user(username: str):
    if username in fake_users_db:
        user_dict = fake_users_db[username]
        return user_dict
    return None


@app.post("/login")
async def login_for_access_token(form_data: LoginForm):
    user = get_user(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    payload = {
        "sub": form_data.username,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": access_token, "token_type": "bearer"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
