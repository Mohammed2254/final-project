from app.extensions import db
from app.models.payment import Payment


class PaymentRepository:

    def add(self, payment: Payment) -> Payment:
        db.session.add(payment)
        db.session.commit()
        return payment

    def get_by_id(self, payment_id: int) -> Payment | None:
        return Payment.query.get(payment_id)

    def get_by_gateway_payment_id(self, gateway_payment_id: str) -> Payment | None:
        return Payment.query.filter_by(
            gateway_payment_id=gateway_payment_id
        ).first()

    def get_by_booking_id(self, booking_id: int) -> list[Payment]:
        return Payment.query.filter_by(
            booking_id=booking_id
        ).all()
