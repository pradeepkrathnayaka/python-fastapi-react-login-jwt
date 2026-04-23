import pytest

from src.utils.validators import is_strong_password, is_valid_email, is_valid_username


class TestUsernameValidator:
    def test_valid_usernames(self):
        for name in ("alice", "Bob_1", "x-y-z", "user123"):
            assert is_valid_username(name), name

    def test_too_short(self):
        assert not is_valid_username("ab")

    def test_invalid_chars(self):
        assert not is_valid_username("user name")
        assert not is_valid_username("user@name")


class TestEmailValidator:
    def test_valid_emails(self):
        for addr in ("user@example.com", "a.b+c@x.org"):
            assert is_valid_email(addr), addr

    def test_invalid_emails(self):
        assert not is_valid_email("notanemail")
        assert not is_valid_email("@nodomain")


class TestPasswordStrength:
    def test_strong_password(self):
        ok, failures = is_strong_password("Secure@123")
        assert ok
        assert failures == []

    def test_missing_uppercase(self):
        ok, failures = is_strong_password("secure@123")
        assert not ok
        assert any("uppercase" in f for f in failures)

    def test_missing_digit(self):
        ok, failures = is_strong_password("Secure@abc")
        assert not ok
        assert any("digit" in f for f in failures)

    def test_too_short(self):
        ok, failures = is_strong_password("Ab@1")
        assert not ok
