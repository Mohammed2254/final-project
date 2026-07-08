from datetime import datetime

from app.extensions import db

from app.models.provider_profile import ServiceProviderProfile
from app.models.service_category import ServiceCategory


class Service(db.Model):
    __tablename__ = "services"

    service_id = db.Column(
        db.Integer,
        primary_key=True
    )

    provider_profile_id = db.Column(
        db.Integer,
        db.ForeignKey("service_provider_profiles.provider_profile_id"),
        nullable=False
    )

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("service_categories.category_id"),
        nullable=False
    )

    service_name = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    price = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    is_active = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    # ==========================
    # Relationships
    # ==========================

    provider = db.relationship(
        ServiceProviderProfile,
        back_populates="services"
    )

    category = db.relationship(
        ServiceCategory,
        back_populates="services"
    )

    hall_details = db.relationship(
        "HallDetails",
        back_populates="service",
        uselist=False,
        cascade="all, delete-orphan"
    )
    
    photographer_details = db.relationship(
        "PhotographerDetails",
        back_populates="service",
        uselist=False,
        cascade="all, delete-orphan"
    )

    