import json
from datetime import datetime
from decimal import Decimal

from app.models.payment import Payment
from app.repositories.payment_repository import PaymentRepository
from app.services.booking_service import BookingService
from app.utils.moyasar_helper import MoyasarHelper


class PaymentService:

    def __init__(self):
        self.repository = PaymentRepository()
        self.booking_service = BookingService()

    def confirm_payment(
        self,
        gateway_payment_id: str,
        booking_id: int,
        paid_by_profile_id: int
    ) -> Payment:

        booking = self.booking_service.get_by_id(booking_id)

        if booking is None:
            raise ValueError("Booking not found.")

        if booking.customer_profile_id != paid_by_profile_id:
            raise ValueError("You do not have access to this booking.")

        # Confirming twice (e.g. the customer refreshes the callback page)
        # should be a no-op, not a duplicate row or an error.
        existing = self.repository.get_by_gateway_payment_id(
            gateway_payment_id
        )
        if existing is not None:
            return existing

        gateway_data = MoyasarHelper.fetch_payment(gateway_payment_id)

        if gateway_data.get("status") != "paid":
            raise ValueError("Payment was not completed successfully.")

        # The payment itself was created client-side (see
        # services/moyasar/createPayment.ts) with an amount the browser
        # chose - never trust that without checking it against the booking
        # here, or a tampered client could pay 1 SAR and have it accepted
        # against any booking total.
        expected_amount = int(booking.total_price * 100)
        if gateway_data.get("amount") != expected_amount:
            raise ValueError(
                "Payment amount does not match the booking total."
            )

        payment = Payment(
            booking_id=booking.booking_id,
            paid_by_profile_id=paid_by_profile_id,
            amount=Decimal(gateway_data["amount"]) / 100,
            currency=gateway_data.get("currency", "SAR"),
            gateway_payment_id=gateway_data["id"],
            status=gateway_data["status"],
            raw_response=json.dumps(gateway_data),
            paid_at=datetime.utcnow()
        )

        return self.repository.add(payment)

    def get_by_booking_id(self, booking_id: int) -> list[Payment]:
        return self.repository.get_by_booking_id(booking_id)
