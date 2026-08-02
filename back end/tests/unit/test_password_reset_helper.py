"""Unit tests for PasswordResetHelper - the stateless (no DB column)
signed token used by the forgot/reset password flow."""
import pytest

from app.utils.password_reset_helper import PasswordResetHelper


def test_a_generated_token_verifies_back_to_the_same_account_id(app):
    token = PasswordResetHelper.generate_token(42)

    assert PasswordResetHelper.verify_token(token) == 42


def test_a_tampered_token_is_rejected(app):
    token = PasswordResetHelper.generate_token(42)
    tampered = token[:-1] + ("a" if token[-1] != "a" else "b")

    with pytest.raises(ValueError):
        PasswordResetHelper.verify_token(tampered)


def test_garbage_input_is_rejected(app):
    with pytest.raises(ValueError):
        PasswordResetHelper.verify_token("not-a-real-token")


def test_an_expired_token_is_rejected(app):
    token = PasswordResetHelper.generate_token(42)

    # max_age=-1 means "must be no older than -1 seconds", which nothing
    # ever satisfies - forces the expired path without sleeping in a test.
    with pytest.raises(ValueError):
        PasswordResetHelper.verify_token(token, max_age=-1)
