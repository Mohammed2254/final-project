from app.models.user_profile import UserProfile
from app.repositories.base_repository import BaseRepository

class UserProfileRepository(BaseRepository):

    def __init__(self):
        super().__init__(UserProfile)

    def get_by_account_id(self, account_id: int) -> UserProfile | None:
        
        return UserProfile.query.filter_by(
            account_id=account_id
        ).one_or_none()

    def exists(self, account_id: int) -> bool:
        return self.get_by_account_id(account_id) is not None