from app.models.provider_profile import ServiceProviderProfile
from app.repositories.base_repository import BaseRepository

class ProviderProfileRepository(BaseRepository):

    def __init__(self):
        super().__init__(ServiceProviderProfile)

    def get_by_account_id(self, account_id: int) -> ServiceProviderProfile | None:
        return ServiceProviderProfile.query.filter_by(
            account_id=account_id
        ).one_or_none()

    def exists(self, account_id: int) -> bool:
        return self.get_by_account_id(account_id) is not None

    def get_by_business_name(self, business_name: str) -> ServiceProviderProfile | None:
        return ServiceProviderProfile.query.filter_by(
            business_name=business_name
        ).one_or_none()