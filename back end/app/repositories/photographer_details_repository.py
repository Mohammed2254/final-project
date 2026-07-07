from app.extensions import db
from app.models.photographer_details import PhotographerDetails


class PhotographerDetailsRepository:

    def add(self, photographer_details: PhotographerDetails) -> PhotographerDetails:
        db.session.add(photographer_details)
        db.session.commit()
        return photographer_details

    def get_by_id(self, photographer_details_id: int) -> PhotographerDetails | None:
        return PhotographerDetails.query.get(photographer_details_id)

    def get_by_service_id(self, service_id: int) -> PhotographerDetails | None:
        return PhotographerDetails.query.filter_by(
            service_id=service_id
        ).first()

    def get_all(self) -> list[PhotographerDetails]:
        return PhotographerDetails.query.all()

    def exists(self, service_id: int) -> bool:
        return self.get_by_service_id(service_id) is not None

    def update(self) -> None:
        db.session.commit()

    def delete(self, photographer_details: PhotographerDetails) -> None:
        db.session.delete(photographer_details)
        db.session.commit()