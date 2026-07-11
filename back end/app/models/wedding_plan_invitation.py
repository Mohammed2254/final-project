from datetime import datetime, timedelta

from app.extensions import db


class WeddingPlanInvitation(db.Model):
    __tablename__ = "wedding_plan_invitations"

    invitation_id = db.Column(
        db.Integer,
        primary_key=True
    )

    plan_id = db.Column(
        db.Integer,
        db.ForeignKey("wedding_plans.plan_id"),
        nullable=False
    )

    invited_email = db.Column(
        db.String(255),
        nullable=False
    )

    invite_code = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="PENDING"
    )

    accepted_by_profile_id = db.Column(
        db.Integer,
        db.ForeignKey("user_profiles.user_profile_id"),
        nullable=True
    )

    expires_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.utcnow() + timedelta(days=7)
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    plan = db.relationship(
        "WeddingPlan",
        back_populates="invitations"
    )

    accepted_by = db.relationship(
        "UserProfile",
        foreign_keys=[accepted_by_profile_id],
        back_populates="accepted_wedding_plan_invitations"
    )