from app.extensions import db

class UserProfile(db.Model):
    __tablename__ = "user_profiles"

    user_profile_id = db.Column(
        db.Integer,
        primary_key=True
    )

    account_id = db.Column(
        db.Integer,
        db.ForeignKey("accounts.account_id"),
        nullable=False,
        unique=True
    )

    full_name = db.Column(
        db.String(100),
        nullable=False
    )

    account = db.relationship(
        "Account",
        back_populates="user_profile"
    )

    bookings = db.relationship(
        "Booking",
        back_populates="customer"
    )

    owned_wedding_plans = db.relationship(
        "WeddingPlan",
        foreign_keys="WeddingPlan.owner_profile_id",
        back_populates="owner"
    )

    joined_wedding_plans = db.relationship(
        "WeddingPlan",
        foreign_keys="WeddingPlan.partner_profile_id",
        back_populates="partner"
    )

