from app.extensions import db

class ServiceCategory(db.Model):
    __tablename__ = "service_categories"

    category_id = db.Column(
        db.Integer,
        primary_key=True
    )

    category_name = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    services = db.relationship(
        "Service",
        back_populates="category"
    )
