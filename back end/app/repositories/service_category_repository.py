from app.models.service_category import ServiceCategory
from app.repositories.base_repository import BaseRepository


class ServiceCategoryRepository(BaseRepository):

    def __init__(self):
        super().__init__(ServiceCategory)
