from app.extensions import db
from app.models.booking_item import BookingItem


class BookingItemRepository:

    def add(self, booking_item: BookingItem) -> BookingItem:
        db.session.add(booking_item)
        db.session.commit()
        return booking_item

    def get_by_id(self, booking_item_id: int) -> BookingItem | None:
        return BookingItem.query.get(booking_item_id)

    def get_all(self) -> list[BookingItem]:
        return BookingItem.query.all()

    def get_by_booking_id(self, booking_id: int) -> list[BookingItem]:
        return BookingItem.query.filter_by(
            booking_id=booking_id
        ).all()

    def get_by_service_id(self, service_id: int) -> list[BookingItem]:
        return BookingItem.query.filter_by(
            service_id=service_id
        ).all()

    def update(self) -> None:
        db.session.commit()

    def delete(self, booking_item: BookingItem) -> None:
        db.session.delete(booking_item)
        db.session.commit()