from app.extensions import bcrypt

class PasswordHelper:

    @staticmethod
    def hash_password(password: str) -> str:
        hashed_password = bcrypt.generate_password_hash(password)

        return hashed_password.decode("utf-8")

    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        return bcrypt.check_password_hash(
            password_hash,
            password
        )