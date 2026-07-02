from app.models.service import Service
from app.repositories.base_repository import BaseRepository

class ServiceRepository(BaseRepository):

    def __init__(self):
        super().__init__(Service)

    def get_by_provider_id(self, provider_profile_id: int):
        return Service.query.filter_by(
            provider_profile_id=provider_profile_id
        ).all()

    def get_by_category_id(self, category_id: int):
        return Service.query.filter_by(
            category_id=category_id,
            is_active=True
        ).all()

    def get_active_services(self):
        return Service.query.filter_by(
            is_active=True
        ).all()

    def search_by_name(self, keyword: str):
        return Service.query.filter(
            Service.service_name.ilike(f"%{keyword}%"),
            Service.is_active == True
        ).all()

    def get_by_price_range(self, min_price=None, max_price=None):
        query = Service.query.filter_by(is_active=True)

        if min_price is not None:
            query = query.filter(Service.price >= min_price)

        if max_price is not None:
            query = query.filter(Service.price <= max_price)

        return query.all()
