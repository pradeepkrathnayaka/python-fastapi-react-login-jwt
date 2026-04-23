"""Reusable test user data fixtures."""

PLAIN_PASSWORD = "Test@123456"
ADMIN_PASSWORD = "Admin@123456"

REGULAR_USER = {
    "email": "test@example.com",
    "username": "testuser",
    "password": PLAIN_PASSWORD,
    "full_name": "Test User",
    "is_active": True,
    "is_superuser": False,
}

ADMIN_USER = {
    "email": "admin@example.com",
    "username": "admin",
    "password": ADMIN_PASSWORD,
    "full_name": "Admin User",
    "is_active": True,
    "is_superuser": True,
}

INACTIVE_USER = {
    "email": "inactive@example.com",
    "username": "inactive",
    "password": PLAIN_PASSWORD,
    "full_name": "Inactive User",
    "is_active": False,
    "is_superuser": False,
}
