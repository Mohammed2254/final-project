from datetime import datetime

from app.extensions import db
from app.models.enums import AccountRole


class Account(db.Model):
    __tablename__ = "accounts"

    account_id = db.Column(
        db.Integer,
        primary_key=True
    )

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.Enum(AccountRole),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    # Relationships

    user_profile = db.relationship(
        "UserProfile",
        back_populates="account",
        uselist=False,
        cascade="all, delete-orphan"
    )

    provider_profile = db.relationship(
        "ServiceProviderProfile",
        back_populates="account",
        uselist=False,
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return (
            f"<Account(id={self.account_id}, "
            f"email='{self.email}', "
            f"role='{self.role.value}')>"
        )