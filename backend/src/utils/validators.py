import re


USERNAME_RE = re.compile(r"^[a-zA-Z0-9_-]{3,50}$")
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def is_valid_username(username: str) -> bool:
    return bool(USERNAME_RE.match(username))


def is_valid_email(email: str) -> bool:
    return bool(EMAIL_RE.match(email))


def is_strong_password(password: str) -> tuple[bool, list[str]]:
    """Return (is_strong, list_of_failures)."""
    failures: list[str] = []
    if len(password) < 8:
        failures.append("at least 8 characters")
    if not re.search(r"[A-Z]", password):
        failures.append("one uppercase letter")
    if not re.search(r"[a-z]", password):
        failures.append("one lowercase letter")
    if not re.search(r"\d", password):
        failures.append("one digit")
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        failures.append("one special character")
    return len(failures) == 0, failures
