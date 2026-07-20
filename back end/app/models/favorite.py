from datetime import datetime

from app.extensions import db


class Favorite(db.Model):
    __tablename__ = "favorites"

    favorite_id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_profile_id = db.Column(
        db.Integer,
        db.ForeignKey("user_profiles.user_profile_id"),
        nullable=False
    )

    service_id = db.Column(
        db.Integer,
        db.ForeignKey("services.service_id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    __table_args__ = (
        db.UniqueConstraint(
            "user_profile_id",
            "service_id",
            name="uq_favorite_user_service"
        ),
    )

    user_profile = db.relationship(
        "UserProfile",
        back_populates="favorites"
    )

    service = db.relationship(
        "Service",
        back_populates="favorited_by"
    )
