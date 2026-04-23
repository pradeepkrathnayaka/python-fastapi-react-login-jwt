"""Seed development data into the database."""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.db.session import SessionLocal
from src.db.init_db import init_db
from src.models.user import User
from src.core.security import get_password_hash

SEED_USERS = [
    {
        "email": "alice@example.com",
        "username": "alice",
        "password": "Alice@1234",
        "full_name": "Alice Smith",
        "is_superuser": False,
    },
    {
        "email": "bob@example.com",
        "username": "bob",
        "password": "Bob@12345",
        "full_name": "Bob Jones",
        "is_superuser": False,
    },
]


def seed() -> None:
    db = SessionLocal()
    try:
        init_db(db)  # Ensures tables exist and admin is created

        for data in SEED_USERS:
            if db.query(User).filter(User.email == data["email"]).first():
                print(f"  Skipping existing user: {data['email']}")
                continue
            user = User(
                email=data["email"],
                username=data["username"],
                hashed_password=get_password_hash(data["password"]),
                full_name=data.get("full_name"),
                is_active=True,
                is_superuser=data.get("is_superuser", False),
            )
            db.add(user)
        db.commit()
        print("Seed data inserted successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
