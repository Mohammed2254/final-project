"""Unit tests for AuthService.forgot_password / reset_password.

EmailHelper.send_password_reset_email is mocked everywhere here - these
tests must never make a real network call to Resend."""
from unittest.mock import patch

import pytest

from app.services.auth_service import AuthService
from app.services.account_service import AccountService
from app.utils.password_reset_helper import PasswordResetHelper


def _register_customer():
    return AuthService().register_customer({
        "full_name": "Nora Ali",
        "email": "nora@example.com",
        "password": "password123",
    })


@patch("app.services.auth_service.EmailHelper.send_password_reset_email")
def test_forgot_password_emails_a_reset_link_for_a_known_account(mock_send, app):
    _register_customer()

    AuthService().forgot_password("nora@example.com")

    mock_send.assert_called_once()
    to_email, reset_url = mock_send.call_args[0]
    assert to_email == "nora@example.com"
    assert "/auth/reset-password?token=" in reset_url


@patch("app.services.auth_service.EmailHelper.send_password_reset_email")
def test_forgot_password_sends_nothing_for_an_unknown_email(mock_send, app):
    AuthService().forgot_password("nobody@example.com")

    mock_send.assert_not_called()


def test_reset_password_with_a_valid_token_changes_the_password(app):
    result = _register_customer()
    account_id = result["account"]["account_id"]

    token = PasswordResetHelper.generate_token(account_id)
    AuthService().reset_password(token, "newpassword456")

    assert AccountService().verify_password("nora@example.com", "newpassword456")
    assert not AccountService().verify_password("nora@example.com", "password123")


def test_reset_password_rejects_an_invalid_token(app):
    with pytest.raises(ValueError):
        AuthService().reset_password("not-a-real-token", "newpassword456")
