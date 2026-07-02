from app.extensions import db

class ServiceProviderProfile(db.Model):
    __tablename__ = "service_provider_profiles"

    provider_profile_id = db.Column(
        db.Integer,
        primary_key=True
    )

    account_id = db.Column(
        db.Integer,
        db.ForeignKey("accounts.account_id"),
        nullable=False,
        unique=True
    )

    business_name = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    phone_number = db.Column(
        db.String(20),
        nullable=False
    )

    logo_path = db.Column(
        db.String(255),
        nullable=True
    )

    account = db.relationship(
        "Account",
        back_populates="provider_profile"
    )

    services = db.relationship(
        "Service",
        back_populates="provider",
        cascade="all, delete-orphan"
    )
