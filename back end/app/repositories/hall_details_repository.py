from app.models.hall_details import HallDetails
from app.repositories.base_repository import BaseRepository


class HallDetailsRepository(BaseRepository):

    def __init__(self):
        super().__init__(HallDetails)

    def get_by_service_id(self, service_id: int) -> HallDetails | None:
        return HallDetails.query.filter_by(
            service_id=service_id
        ).one_or_none()

    def exists(self, service_id: int) -> bool:
        return self.get_by_service_id(service_id) is not None