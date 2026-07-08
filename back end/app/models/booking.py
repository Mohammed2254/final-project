from datetime import datetime

from app.extensions import db

class Booking(db.Model):
    __tablename__ = "bookings"

    booking_id = db.Column(
        db.Integer,
        primary_key=True
    )

    customer_profile_id = db.Column(
        db.Integer,
        db.ForeignKey("user_profiles.user_profile_id"),
        nullable=False
    )

    event_date = db.Column(
        db.Date,
        nullable=False
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="PENDING"
    )

    notes = db.Column(
        db.Text,
        nullable=True
    )

    total_price = db.Column(
        db.Numeric(10, 2),
        nullable=False,
        default=0
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    customer = db.relationship(
        "UserProfile",
        back_populates="bookings"
    )

    booking_items = db.relationship(
        "BookingItem",
        back_populates="booking",
        cascade="all, delete-orphan"
    )
    
    
    
