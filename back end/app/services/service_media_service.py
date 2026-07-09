from app.models.service_media import ServiceMedia
from app.repositories.service_media_repository import ServiceMediaRepository


class ServiceMediaService:

    def __init__(self):
        self.repository = ServiceMediaRepository()

    def add_media(
        self,
        service_id: int,
        media_url: str,
        media_type: str = "IMAGE",
        is_main: bool = False
    ) -> ServiceMedia:

        if is_main:
            self.repository.unset_main_for_service(service_id)

        media = ServiceMedia(
            service_id=service_id,
            media_url=media_url,
            media_type=media_type,
            is_main=is_main
        )

        return self.repository.add(media)

    def get_all(self) -> list[ServiceMedia]:
        return self.repository.get_all()

    def get_by_id(self, media_id: int) -> ServiceMedia | None:
        return self.repository.get_by_id(media_id)

    def get_by_service_id(self, service_id: int) -> list[ServiceMedia]:
        return self.repository.get_by_service_id(service_id)

    def get_main_by_service_id(self, service_id: int) -> ServiceMedia | None:
        return self.repository.get_main_by_service_id(service_id)

    def update_media(
        self,
        media_id: int,
        data: dict
    ) -> ServiceMedia:

        media = self.get_by_id(media_id)

        if media is None:
            raise ValueError("Media not found.")

        if data.get("is_main") is True:
            self.repository.unset_main_for_service(media.service_id)

        for key, value in data.items():
            setattr(media, key, value)

        self.repository.update()

        return media

    def delete_media(self, media_id: int) -> bool:

        media = self.get_by_id(media_id)

        if media is None:
            raise ValueError("Media not found.")

        self.repository.delete(media)

        return True