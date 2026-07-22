"""Unit tests for AuthService - registration and login logic."""
import pytest

from app.services.auth_service import AuthService


CUSTOMER_DATA = {
    "full_name": "Sara Ahmed",
    "email": "sara@example.com",
    "password": "supersecret123",
}


def test_register_customer_returns_token_and_account(app):
    service = AuthService()

    result = service.register_customer(CUSTOMER_DATA)

    assert "access_token" in result
    assert result["account"]["email"] == "sara@example.com"
    assert result["account"]["role"] == "Customer"
    assert result["user_profile"]["full_name"] == "Sara Ahmed"


def test_register_customer_rejects_duplicate_email(app):
    service = AuthService()
    service.register_customer(CUSTOMER_DATA)

    # Registering the same email again must fail.
    with pytest.raises(ValueError, match="Email already exists."):
        service.register_customer(CUSTOMER_DATA)


def test_login_succeeds_with_correct_password(app):
    service = AuthService()
    service.register_customer(CUSTOMER_DATA)

    result = service.login({
        "email": "sara@example.com",
        "password": "supersecret123",
    })

    assert "access_token" in result
    assert result["account"]["email"] == "sara@example.com"


def test_login_fails_with_wrong_password(app):
    service = AuthService()
    service.register_customer(CUSTOMER_DATA)

    with pytest.raises(ValueError, match="Invalid email or password."):
        service.login({
            "email": "sara@example.com",
            "password": "wrongpassword",
        })


def test_login_fails_for_unknown_email(app):
    service = AuthService()

    with pytest.raises(ValueError, match="Invalid email or password."):
        service.login({
            "email": "ghost@example.com",
            "password": "whatever123",
        })
