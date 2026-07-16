from app.models.enums import AccountRole
from app.services.account_service import AccountService
from app.services.user_profile_service import UserProfileService
from app.services.provider_profile_service import ProviderProfileService
from app.utils.password_helper import PasswordHelper
from app.utils.jwt_helper import JwtHelper

class AuthService:

    def __init__(self):
        self.account_service = AccountService()
        self.user_profile_service = UserProfileService()
        self.provider_profile_service = ProviderProfileService()

    def register_customer(self, data):
        account = self.account_service.create_account(
            email=data["email"],
            password=data["password"],
            role=AccountRole.CUSTOMER
        )

        user_profile = self.user_profile_service.create_profile(
            account_id=account.account_id,
            full_name=data["full_name"]
        )

        token = JwtHelper.create_token(
            account_id=account.account_id,
            role=account.role.value
        )

        return {
            "access_token": token,
            "account": {
                "account_id": account.account_id,
                "email": account.email,
                "role": account.role.value
            },
            "user_profile": {
                "user_profile_id": user_profile.user_profile_id,
                "full_name": user_profile.full_name
            }
        }

    def register_provider(self, data):
        account = self.account_service.create_account(
            email=data["email"],
            password=data["password"],
            role=AccountRole.PROVIDER
        )

        provider_profile = self.provider_profile_service.create_profile(
            account_id=account.account_id,
            business_name=data["business_name"],
            description=data.get("description"),
            phone_number=data["phone_number"],
            logo_path=data.get("logo_path")
        )

        token = JwtHelper.create_token(
            account_id=account.account_id,
            role=account.role.value
        )

        return {
            "access_token": token,
            "account": {
                "account_id": account.account_id,
                "email": account.email,
                "role": account.role.value
            },
            "provider_profile": {
                "provider_profile_id": provider_profile.provider_profile_id,
                "business_name": provider_profile.business_name
            }
        }

    def login(self, data):
        account = self.account_service.get_by_email(data["email"])

        if account is None:
            raise ValueError("Invalid email or password.")

        is_valid_password = PasswordHelper.verify_password(
            password=data["password"],
            password_hash=account.password_hash
        )

        if not is_valid_password:
            raise ValueError("Invalid email or password.")

        token = JwtHelper.create_token(
            account_id=account.account_id,
            role=account.role.value
        )

        result = {
            "access_token": token,
            "role": account.role.value,
            "account": {
                "account_id": account.account_id,
                "email": account.email,
                "role": account.role.value
            }
        }

        if account.role == AccountRole.CUSTOMER:
            user_profile = self.user_profile_service.get_by_account_id(
                account.account_id
            )

            if user_profile is not None:
                result["user_profile"] = {
                    "user_profile_id": user_profile.user_profile_id,
                    "full_name": user_profile.full_name
                }

        if account.role == AccountRole.PROVIDER:
            provider_profile = (
                self.provider_profile_service.get_by_account_id(
                    account.account_id
                )
            )

            if provider_profile is not None:
                result["provider_profile"] = {
                    "provider_profile_id": (
                        provider_profile.provider_profile_id
                    ),
                    "business_name": provider_profile.business_name
                }

        return result
