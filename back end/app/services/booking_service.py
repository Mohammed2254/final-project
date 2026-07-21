from app.models.booking import Booking
from app.repositories.booking_repository import BookingRepository
from app.services.BookingItemService import BookingItemService

class BookingService:

    def __init__(self):
        self.repository = BookingRepository()
        self.booking_item_service = BookingItemService()

    def create_booking(
        self,
        customer_profile_id: int,
        event_date,
        items: list,
        notes: str = None
    ) -> Booking:

        booking = Booking(
            customer_profile_id=customer_profile_id,
            event_date=event_date,
            notes=notes
        )

        booking = self.repository.add(booking)

        total_price = 0

        for item in items:

            self.booking_item_service.add_booking_item(
                booking_id=booking.booking_id,
                service_id=item["service_id"],
                quantity=item.get("quantity", 1),
                price_at_booking=item["price_at_booking"],
                notes=item.get("notes")
            )

            total_price += (
                item["price_at_booking"] *
                item.get("quantity", 1)
            )

        booking.total_price = total_price

        self.repository.update()

        return booking

    def get_all(self) -> list[Booking]:
        return self.repository.get_all()

    def get_by_id(self, booking_id: int) -> Booking | None:
        return self.repository.get_by_id(booking_id)

    def get_by_customer_id(
        self,
        customer_profile_id: int
    ) -> list[Booking]:

        return self.repository.get_by_customer_id(
            customer_profile_id
        )

    def get_by_provider_id(
        self,
        provider_profile_id: int
    ) -> list[Booking]:

        return self.repository.get_by_provider_id(
            provider_profile_id
        )

    def is_provider_booking(
        self,
        booking: Booking,
        provider_profile_id: int
    ) -> bool:

        return any(
            item.service.provider_profile_id == provider_profile_id
            for item in booking.booking_items
        )

    def update_booking_by_customer(
        self,
        booking_id: int,
        customer_profile_id: int,
        data: dict
    ) -> Booking:

        booking = self.get_by_id(booking_id)

        if booking is None:
            raise ValueError("Booking not found.")

        if booking.customer_profile_id != customer_profile_id:
            raise ValueError("You do not have access to this booking.")

        allowed_fields = {"event_date", "notes"}

        for key, value in data.items():
            if key in allowed_fields:
                setattr(booking, key, value)

        self.repository.update()

        return booking

    def update_status_by_provider(
        self,
        booking_id: int,
        provider_profile_id: int,
        new_status: str
    ) -> Booking:

        if new_status not in {"CONFIRMED", "REJECTED"}:
            raise ValueError("Status must be CONFIRMED or REJECTED.")

        booking = self.get_by_id(booking_id)

        if booking is None:
            raise ValueError("Booking not found.")

        if not self.is_provider_booking(booking, provider_profile_id):
            raise ValueError("You do not have access to this booking.")

        booking.status = new_status

        self.repository.update()

        return booking

    def delete_booking(
        self,
        booking_id: int,
        customer_profile_id: int
    ) -> bool:

        booking = self.get_by_id(booking_id)

        if booking is None:
            raise ValueError("Booking not found.")

        if booking.customer_profile_id != customer_profile_id:
            raise ValueError("You do not have access to this booking.")

        self.repository.delete(booking)

        return True