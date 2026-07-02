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

