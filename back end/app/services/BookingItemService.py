from app.models.booking_item import BookingItem
from app.repositories.booking_item_repository import BookingItemRepository


class BookingItemService:

    def __init__(self):
        self.repository = BookingItemRepository()

    def add_booking_item(
        self,
        booking_id: int,
        service_id: int,
        price_at_booking,
        quantity: int = 1,
        notes: str = None
    ) -> BookingItem:

        booking_item = BookingItem(
            booking_id=booking_id,
            service_id=service_id,
            quantity=quantity,
            price_at_booking=price_at_booking,
            notes=notes
        )

        return self.repository.add(booking_item)

    def get_all(self) -> list[BookingItem]:
        return self.repository.get_all()

    def get_by_id(self, booking_item_id: int) -> BookingItem | None:
        return self.repository.get_by_id(booking_item_id)

    def get_by_booking_id(
        self,
        booking_id: int
    ) -> list[BookingItem]:

        return self.repository.get_by_booking_id(booking_id)

    def get_by_service_id(
        self,
        service_id: int
    ) -> list[BookingItem]:

        return self.repository.get_by_service_id(service_id)

    def update_booking_item(
        self,
        booking_item_id: int,
        data: dict
    ) -> BookingItem:

        booking_item = self.get_by_id(booking_item_id)

        if booking_item is None:
            raise ValueError("Booking item not found.")

        for key, value in data.items():
            setattr(booking_item, key, value)

        self.repository.update()

        return booking_item

    def delete_booking_item(
        self,
        booking_item_id: int
    ) -> bool:

        booking_item = self.get_by_id(booking_item_id)

        if booking_item is None:
            raise ValueError("Booking item not found.")

        self.repository.delete(booking_item)

        return True