from app.extensions import db
from app.models.booking import Booking
from app.models.booking_item import BookingItem
from app.models.service import Service


class BookingRepository:

    def add(self, booking: Booking) -> Booking:
        db.session.add(booking)
        db.session.commit()
        return booking

    def get_by_id(self, booking_id: int) -> Booking | None:
        return Booking.query.get(booking_id)

    def get_all(self) -> list[Booking]:
        return Booking.query.all()

    def get_by_customer_id(self, customer_profile_id: int) -> list[Booking]:
        return Booking.query.filter_by(
            customer_profile_id=customer_profile_id
        ).all()

    def get_by_provider_id(self, provider_profile_id: int) -> list[Booking]:
        return (
            Booking.query
            .join(BookingItem, BookingItem.booking_id == Booking.booking_id)
            .join(Service, Service.service_id == BookingItem.service_id)
            .filter(Service.provider_profile_id == provider_profile_id)
            .distinct()
            .all()
        )

    def get_by_status(self, status: str) -> list[Booking]:
        return Booking.query.filter_by(
            status=status
        ).all()

    def update(self) -> None:
        db.session.commit()

    def delete(self, booking: Booking) -> None:
        db.session.delete(booking)
        db.session.commit()