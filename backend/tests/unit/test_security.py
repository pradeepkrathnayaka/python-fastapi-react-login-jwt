from datetime import timedelta

import jwt
import pytest

from src.core.config import settings
from src.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)


class TestPasswordHashing:
    def test_hash_and_verify(self):
        plain = "MySecret@1"
        hashed = get_password_hash(plain)
        assert hashed != plain
        assert verify_password(plain, hashed)

    def test_wrong_password_fails(self):
        hashed = get_password_hash("MySecret@1")
        assert not verify_password("wrong", hashed)


class TestTokenCreation:
    def test_access_token_type(self):
        token = create_access_token(subject=42)
        payload = decode_token(token)
        assert payload["type"] == "access"
        assert payload["sub"] == "42"

    def test_refresh_token_type(self):
        token = create_refresh_token(subject=7)
        payload = decode_token(token)
        assert payload["type"] == "refresh"
        assert payload["sub"] == "7"

    def test_custom_expiry(self):
        token = create_access_token(subject=1, expires_delta=timedelta(seconds=1))
        payload = decode_token(token)
        assert payload["sub"] == "1"

    def test_expired_token_raises(self):
        token = create_access_token(subject=1, expires_delta=timedelta(seconds=-1))
        with pytest.raises(jwt.ExpiredSignatureError):
            decode_token(token)

    def test_invalid_token_raises(self):
        with pytest.raises(jwt.InvalidTokenError):
            decode_token("not.a.valid.token")
