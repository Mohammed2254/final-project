from app.extensions import db

class BookingItem(db.Model):
    __tablename__ = "booking_items"

    booking_item_id = db.Column(
        db.Integer,
        primary_key=True
    )

    booking_id = db.Column(
        db.Integer,
        db.ForeignKey("bookings.booking_id"),
        nullable=False
    )

    service_id = db.Column(
        db.Integer,
        db.ForeignKey("services.service_id"),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )

    price_at_booking = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    notes = db.Column(
        db.Text,
        nullable=True
    )

    booking = db.relationship(
        "Booking",
        back_populates="booking_items"
    )

    service = db.relationship(
        "Service",
        back_populates="booking_items"
    )