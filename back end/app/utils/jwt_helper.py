from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    get_jwt
)

class JwtHelper:

    @staticmethod
    def create_token(account_id: int, role: str) -> str:
        return create_access_token(
            identity=str(account_id),
            additional_claims={
                "role": role
            }
        )

    @staticmethod
    def get_account_id() -> int:
        return int(get_jwt_identity())

    @staticmethod
    def get_role() -> str:
        claims = get_jwt()
        return claims["role"]