from app.extensions import db
from app.models.booking import Booking


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

    def get_by_status(self, status: str) -> list[Booking]:
        return Booking.query.filter_by(
            status=status
        ).all()

    def update(self) -> None:
        db.session.commit()

    def delete(self, booking: Booking) -> None:
        db.session.delete(booking)
        db.session.commit()