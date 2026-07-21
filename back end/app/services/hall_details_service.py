from app.models.hall_details import HallDetails
from app.repositories.hall_details_repository import HallDetailsRepository
from app.repositories.service_repository import ServiceRepository

class HallDetailsService:

    def __init__(self):
        self.repository = HallDetailsRepository()
        self.service_repository = ServiceRepository()

    def create_hall_details(
        self,
        service_id: int,
        min_capacity: int,
        max_capacity: int,
        city: str,
        address: str,
        latitude=None,
        longitude=None
    ) -> HallDetails:

        if self.service_repository.get_by_id(service_id) is None:
            raise ValueError("Service not found.")

        if self.repository.exists(service_id):
            raise ValueError("Hall details already exist for this service.")

        if max_capacity < min_capacity:
            raise ValueError("Max capacity cannot be less than min capacity.")

        hall_details = HallDetails(
            service_id=service_id,
            min_capacity=min_capacity,
            max_capacity=max_capacity,
            city=city,
            address=address,
            latitude=latitude,
            longitude=longitude
        )

        return self.repository.add(hall_details)

    def get_all(self) -> list[HallDetails]:
        return self.repository.get_all()

    def get_by_id(self, hall_details_id: int) -> HallDetails | None:
        return self.repository.get_by_id(hall_details_id)

    def get_by_service_id(self, service_id: int) -> HallDetails | None:
        return self.repository.get_by_service_id(service_id)

    def update_hall_details(self, hall_details_id: int, data: dict) -> HallDetails:
        hall_details = self.get_by_id(hall_details_id)

        if hall_details is None:
            raise ValueError("Hall details not found.")

        for key, value in data.items():
            setattr(hall_details, key, value)

        self.repository.update()

        return hall_details

    def delete_hall_details(self, hall_details_id: int) -> bool:
        hall_details = self.get_by_id(hall_details_id)

        if hall_details is None:
            raise ValueError("Hall details not found.")

        self.repository.delete(hall_details)

        return True
