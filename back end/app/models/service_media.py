from datetime import datetime

from app.extensions import db


class ServiceMedia(db.Model):
    __tablename__ = "service_media"

    media_id = db.Column(
        db.Integer,
        primary_key=True
    )

    service_id = db.Column(
        db.Integer,
        db.ForeignKey("services.service_id"),
        nullable=False
    )

    media_url = db.Column(
        db.String(500),
        nullable=False
    )

    media_type = db.Column(
        db.String(30),
        nullable=False,
        default="IMAGE"
    )

    is_main = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    service = db.relationship(
        "Service",
        back_populates="media"
    )