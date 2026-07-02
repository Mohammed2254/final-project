from app.models.user_profile import UserProfile
from app.repositories.user_profile_repository import UserProfileRepository

class UserProfileService:

    def __init__(self):
        self.repository = UserProfileRepository()

    def create_profile(self, account_id: int, full_name: str) -> UserProfile:
        if self.repository.exists(account_id):
            raise ValueError("User profile already exists for this account.")

        user_profile = UserProfile(
            account_id=account_id,
            full_name=full_name
        )

        return self.repository.add(user_profile)

    def get_by_id(self, user_profile_id: int) -> UserProfile | None:
        return self.repository.get_by_id(user_profile_id)

    def get_by_account_id(self, account_id: int) -> UserProfile | None:
        return self.repository.get_by_account_id(account_id)