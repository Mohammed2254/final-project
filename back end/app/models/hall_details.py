from app.extensions import db

class HallDetails(db.Model):
    __tablename__ = "hall_details"

    hall_details_id = db.Column(
        db.Integer,
        primary_key=True
    )

    service_id = db.Column(
        db.Integer,
        db.ForeignKey("services.service_id"),
        nullable=False,
        unique=True
    )

    min_capacity = db.Column(
        db.Integer,
        nullable=False
    )

    max_capacity = db.Column(
        db.Integer,
        nullable=False
    )

    city = db.Column(
        db.String(100),
        nullable=False
    )

    address = db.Column(
        db.String(255),
        nullable=False
    )

    latitude = db.Column(
        db.Numeric(10, 7),
        nullable=True
    )

    longitude = db.Column(
        db.Numeric(10, 7),
        nullable=True
    )

    service = db.relationship(
        "Service",
        back_populates="hall_details"
    )

