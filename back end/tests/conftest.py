"""
Shared pytest fixtures.

Every test runs against a throwaway in-memory SQLite database
(see TestingConfig), so tests never touch the real PostgreSQL data and
each test starts from a clean slate.
"""
import os

import pytest

# Must be set before create_app() reads it, so the app picks TestingConfig.
os.environ["FLASK_ENV"] = "testing"

from app import create_app
from app.extensions import db


@pytest.fixture
def app():
    app = create_app()

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """A test client for firing HTTP requests at the API."""
    return app.test_client()
