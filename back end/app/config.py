import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
    PAYMENT_GATEWAY_KEY = os.getenv("PAYMENT_GATEWAY_KEY")
    PAYMENT_WEBHOOK_SECRET = os.getenv("PAYMENT_WEBHOOK_SECRET")
    RESEND_API_KEY = os.getenv("RESEND_API_KEY")
    RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    MOYASAR_SECRET_KEY = os.getenv("MOYASAR_SECRET_KEY")

    # Lets the demo complete a payment without a live Moyasar charge, because
    # Moyasar's test keys reject real cards and its test card always goes
    # through a 3D Secure page we can't rely on during a presentation.
    # Defaults to off: with this on, anyone can mark a booking paid.
    PAYMENT_DEMO_MODE = os.getenv("PAYMENT_DEMO_MODE", "false").lower() == "true"


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DEV_DATABASE_URL",
        "sqlite:///wedding_planning.db"
    )


def _normalize_db_url(url):
    # Render gives postgres:// or postgresql:// - force the psycopg v3 driver
    if not url:
        return url

    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)

    return url


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = _normalize_db_url(
        os.getenv("PROD_DATABASE_URL")
    )


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"