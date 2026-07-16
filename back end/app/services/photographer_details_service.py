from app.models.photographer_details import PhotographerDetails
from app.repositories.photographer_details_repository import PhotographerDetailsRepository
from app.repositories.service_repository import ServiceRepository


class PhotographerDetailsService:

    def __init__(self):
        self.repository = PhotographerDetailsRepository()
        self.service_repository = ServiceRepository()

    def create_photographer_details(
        self,
        service_id: int,
        coverage_hours: int,
        camera_type: str = None,
        has_video: bool = False,
        has_drone: bool = False,
        portfolio_url: str = None
    ) -> PhotographerDetails:

        if self.service_repository.get_by_id(service_id) is None:
            raise ValueError("Service not found.")

        if self.repository.exists(service_id):
            raise ValueError("Photographer details already exist for this service.")

        photographer_details = PhotographerDetails(
            service_id=service_id,
            camera_type=camera_type,
            coverage_hours=coverage_hours,
            has_video=has_video,
            has_drone=has_drone,
            portfolio_url=portfolio_url
        )

        return self.repository.add(photographer_details)

    def get_all(self) -> list[PhotographerDetails]:
        return self.repository.get_all()

    def get_by_id(self, photographer_details_id: int) -> PhotographerDetails | None:
        return self.repository.get_by_id(photographer_details_id)

    def get_by_service_id(self, service_id: int) -> PhotographerDetails | None:
        return self.repository.get_by_service_id(service_id)

    def update_photographer_details(
        self,
        photographer_details_id: int,
        data: dict
    ) -> PhotographerDetails:

        photographer_details = self.get_by_id(photographer_details_id)

        if photographer_details is None:
            raise ValueError("Photographer details not found.")

        for key, value in data.items():
            setattr(photographer_details, key, value)

        self.repository.update()

        return photographer_details

    def delete_photographer_details(self, photographer_details_id: int) -> bool:

        photographer_details = self.get_by_id(photographer_details_id)

        if photographer_details is None:
            raise ValueError("Photographer details not found.")

        self.repository.delete(photographer_details)

        return True
