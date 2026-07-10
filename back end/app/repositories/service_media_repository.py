from app.models.service_media import ServiceMedia
from app.repositories.base_repository import BaseRepository


class ServiceMediaRepository(BaseRepository):

    def __init__(self):
        super().__init__(ServiceMedia)

    def get_by_service_id(self, service_id: int) -> list[ServiceMedia]:
        return ServiceMedia.query.filter_by(
            service_id=service_id
        ).all()

    def get_main_by_service_id(self, service_id: int) -> ServiceMedia | None:
        return ServiceMedia.query.filter_by(
            service_id=service_id,
            is_main=True
        ).first()

    def unset_main_for_service(self, service_id: int) -> None:
        ServiceMedia.query.filter_by(
            service_id=service_id,
            is_main=True
        ).update({"is_main": False})
