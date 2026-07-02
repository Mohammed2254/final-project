from app.models.service import Service
from app.repositories.service_repository import ServiceRepository

class ServiceService:

    def __init__(self):
        self.repository = ServiceRepository()

    def create_service(
        self,
        provider_profile_id: int,
        category_id: int,
        service_name: str,
        description: str,
        price
    ) -> Service:
        service = Service(
            provider_profile_id=provider_profile_id,
            category_id=category_id,
            service_name=service_name,
            description=description,
            price=price,
            is_active=True
        )

        return self.repository.add(service)

    def get_by_id(self, service_id: int) -> Service | None:
        return self.repository.get_by_id(service_id)

    def get_all_active(self):
        return self.repository.get_active_services()

    def get_by_provider_id(self, provider_profile_id: int):
        return self.repository.get_by_provider_id(provider_profile_id)

    def get_by_category_id(self, category_id: int):
        return self.repository.get_by_category_id(category_id)

    def search_by_name(self, keyword: str):
        return self.repository.search_by_name(keyword)

    def filter_by_price(self, min_price=None, max_price=None):
        return self.repository.get_by_price_range(min_price, max_price)

    def update_service(
        self,
        service_id: int,
        service_name: str = None,
        description: str = None,
        price=None,
        category_id: int = None
    ) -> Service:
        service = self.get_by_id(service_id)

        if service is None:
            raise ValueError("Service not found.")

        if service_name is not None:
            service.service_name = service_name

        if description is not None:
            service.description = description

        if price is not None:
            service.price = price

        if category_id is not None:
            service.category_id = category_id

        self.repository.update()

        return service

    def deactivate_service(self, service_id: int) -> Service:
        service = self.get_by_id(service_id)

        if service is None:
            raise ValueError("Service not found.")

        service.is_active = False

        self.repository.update()

        return service