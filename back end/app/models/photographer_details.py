from app.extensions import db

class PhotographerDetails(db.Model):
    __tablename__ = "photographer_details"

    photographer_details_id = db.Column(
        db.Integer,
        primary_key=True
    )

    service_id = db.Column(
        db.Integer,
        db.ForeignKey("services.service_id"),
        nullable=False,
        unique=True
    )

    camera_type = db.Column(
        db.String(100),
        nullable=True
    )

    coverage_hours = db.Column(
        db.Integer,
        nullable=False
    )

    has_video = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    has_drone = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    portfolio_url = db.Column(
        db.String(255),
        nullable=True
    )

    service = db.relationship(
        "Service",
        back_populates="photographer_details"
    )