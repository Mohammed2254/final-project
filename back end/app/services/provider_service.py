from app.models.provider_profile import ServiceProviderProfile
from app.repositories.provider_profile_repository import (
    ProviderProfileRepository
)


class ProviderProfileService:

    def __init__(self):
        self.repository = ProviderProfileRepository()

    def create_profile(
        self,
        account_id: int,
        business_name: str,
        description: str = None,
        phone_number: str = None,
        logo_path: str = None
    ) -> ServiceProviderProfile:

        if self.repository.exists(account_id):
            raise ValueError(
                "Provider profile already exists for this account."
            )

        provider_profile = ServiceProviderProfile(
            account_id=account_id,
            business_name=business_name,
            description=description,
            phone_number=phone_number,
            logo_path=logo_path
        )

        return self.repository.add(provider_profile)

    def get_by_id(
        self,
        provider_profile_id: int
    ) -> ServiceProviderProfile | None:
        return self.repository.get_by_id(provider_profile_id)

    def get_by_account_id(
        self,
        account_id: int
    ) -> ServiceProviderProfile | None:
        return self.repository.get_by_account_id(account_id)

    def get_by_business_name(
        self,
        business_name: str
    ) -> ServiceProviderProfile | None:
        return self.repository.get_by_business_name(business_name)

    def update_profile(
        self,
        provider_profile_id: int,
        business_name: str,
        description: str,
        phone_number: str,
        logo_path: str
    ) -> ServiceProviderProfile:

        provider_profile = self.get_by_id(provider_profile_id)

        if provider_profile is None:
            raise ValueError("Provider profile not found.")

        provider_profile.business_name = business_name
        provider_profile.description = description
        provider_profile.phone_number = phone_number
        provider_profile.logo_path = logo_path

        self.repository.update()

        return provider_profile