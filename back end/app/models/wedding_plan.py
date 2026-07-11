from datetime import datetime

from app.extensions import db


class WeddingPlan(db.Model):
    __tablename__ = "wedding_plans"

    plan_id = db.Column(
        db.Integer,
        primary_key=True
    )

    owner_profile_id = db.Column(
        db.Integer,
        db.ForeignKey("user_profiles.user_profile_id"),
        nullable=False
    )

    partner_profile_id = db.Column(
        db.Integer,
        db.ForeignKey("user_profiles.user_profile_id"),
        nullable=True
    )

    plan_name = db.Column(
        db.String(150),
        nullable=False
    )

    event_date = db.Column(
        db.Date,
        nullable=False
    )

    budget = db.Column(
        db.Numeric(12, 2),
        nullable=False,
        default=0
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="PLANNING"
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

    owner = db.relationship(
        "UserProfile",
        foreign_keys=[owner_profile_id],
        back_populates="owned_wedding_plans"
    )

    partner = db.relationship(
        "UserProfile",
        foreign_keys=[partner_profile_id],
        back_populates="joined_wedding_plans"
    )

    invitations = db.relationship(
        "WeddingPlanInvitation",
        back_populates="plan",
        cascade="all, delete-orphan"
    )

    plan_services = db.relationship(
        "WeddingPlanService",
        back_populates="plan",
        cascade="all, delete-orphan"
    )