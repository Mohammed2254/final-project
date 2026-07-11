from datetime import datetime

from app.extensions import db


class WeddingPlanService(db.Model):
    __tablename__ = "wedding_plan_services"

    plan_service_id = db.Column(
        db.Integer,
        primary_key=True
    )

    plan_id = db.Column(
        db.Integer,
        db.ForeignKey("wedding_plans.plan_id"),
        nullable=False
    )

    service_id = db.Column(
        db.Integer,
        db.ForeignKey("services.service_id"),
        nullable=False
    )

    added_by_profile_id = db.Column(
        db.Integer,
        db.ForeignKey("user_profiles.user_profile_id"),
        nullable=False
    )

    estimated_price = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    notes = db.Column(
        db.Text,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    plan = db.relationship(
        "WeddingPlan",
        back_populates="plan_services"
    )

    service = db.relationship(
        "Service",
        back_populates="wedding_plan_services"
    )

    added_by = db.relationship(
        "UserProfile",
        foreign_keys=[added_by_profile_id],
        back_populates="added_wedding_plan_services"
    )