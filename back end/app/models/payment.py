from datetime import datetime

from app.extensions import db


class Payment(db.Model):
    __tablename__ = "payments"

    payment_id = db.Column(
        db.Integer,
        primary_key=True
    )

    booking_id = db.Column(
        db.Integer,
        db.ForeignKey("bookings.booking_id"),
        nullable=False
    )

    paid_by_profile_id = db.Column(
        db.Integer,
        db.ForeignKey("user_profiles.user_profile_id"),
        nullable=False
    )

    amount = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    currency = db.Column(
        db.String(3),
        nullable=False,
        default="SAR"
    )

    gateway_payment_id = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )

    status = db.Column(
        db.String(30),
        nullable=False
    )

    raw_response = db.Column(
        db.Text,
        nullable=True
    )

    paid_at = db.Column(
        db.DateTime,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    booking = db.relationship(
        "Booking",
        back_populates="payments"
    )

    paid_by = db.relationship(
        "UserProfile",
        back_populates="payments"
    )
