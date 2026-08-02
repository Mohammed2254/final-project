from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import current_app

RESET_TOKEN_SALT = "password-reset"
RESET_TOKEN_MAX_AGE_SECONDS = 1800  # 30 minutes


class PasswordResetHelper:

    @staticmethod
    def generate_token(account_id: int) -> str:
        serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
        return serializer.dumps(account_id, salt=RESET_TOKEN_SALT)

    @staticmethod
    def verify_token(
        token: str,
        max_age: int = RESET_TOKEN_MAX_AGE_SECONDS
    ) -> int:
        serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])

        try:
            return serializer.loads(
                token,
                salt=RESET_TOKEN_SALT,
                max_age=max_age
            )
        except SignatureExpired:
            raise ValueError("This reset link has expired.")
        except BadSignature:
            raise ValueError("This reset link is invalid.")
