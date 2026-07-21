from app.models.service_category import ServiceCategory
from app.repositories.service_category_repository import ServiceCategoryRepository


class ServiceCategoryService:

    def __init__(self):
        self.repository = ServiceCategoryRepository()

    def get_all(self) -> list[ServiceCategory]:
        return self.repository.get_all()

    def get_by_id(self, category_id: int) -> ServiceCategory | None:
        return self.repository.get_by_id(category_id)
