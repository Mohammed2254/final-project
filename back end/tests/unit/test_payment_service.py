"""Unit tests for PaymentService.confirm_payment.

MoyasarHelper.fetch_payment is mocked everywhere here - these tests must
never make a real network call to Moyasar."""
from datetime import date
from decimal import Decimal
from unittest.mock import patch

import pytest

from app.extensions import db
from app.models.service_category import ServiceCategory
from app.services.auth_service import AuthService
from app.services.booking_service import BookingService
from app.services.payment_service import PaymentService
from app.services.service_service import ServiceService


def _seed_booking(app, total_price=Decimal("100.00")):
    """A customer and a booking of the given total - returns
    (booking_id, customer_profile_id)."""
    auth = AuthService()

    customer = auth.register_customer({
        "full_name": "Nora Ali",
        "email": "nora@example.com",
        "password": "password123",
    })
    customer_profile_id = customer["user_profile"]["user_profile_id"]

    provider = auth.register_provider({
        "business_name": "Golden Hall",
        "phone_number": "0555000111",
        "email": "hall@example.com",
        "password": "password123",
    })

    category = ServiceCategory(category_name="Halls")
    db.session.add(category)
    db.session.commit()

    service = ServiceService().create_service(
        provider_profile_id=provider["provider_profile"]["provider_profile_id"],
        category_id=category.category_id,
        service_name="Grand Ballroom",
        description=None,
        price=total_price,
    )

    booking = BookingService().create_booking(
        customer_profile_id=customer_profile_id,
        event_date=date(2026, 12, 1),
        items=[
            {"service_id": service.service_id, "quantity": 1,
             "price_at_booking": total_price},
        ],
    )

    return booking.booking_id, customer_profile_id


def _moyasar_response(amount_halalas, status="paid", gateway_id="pay_123"):
    return {
        "id": gateway_id,
        "status": status,
        "amount": amount_halalas,
        "currency": "SAR",
    }


@patch("app.services.payment_service.MoyasarHelper.fetch_payment")
def test_confirm_payment_records_a_successful_payment(mock_fetch, app):
    booking_id, profile_id = _seed_booking(app, Decimal("100.00"))
    mock_fetch.return_value = _moyasar_response(10000)

    payment = PaymentService().confirm_payment("pay_123", booking_id, profile_id)

    assert payment.status == "paid"
    assert payment.amount == Decimal("100.00")
    assert payment.gateway_payment_id == "pay_123"


@patch("app.services.payment_service.MoyasarHelper.fetch_payment")
def test_confirm_payment_is_idempotent(mock_fetch, app):
    booking_id, profile_id = _seed_booking(app, Decimal("100.00"))
    mock_fetch.return_value = _moyasar_response(10000)

    first = PaymentService().confirm_payment("pay_123", booking_id, profile_id)
    second = PaymentService().confirm_payment("pay_123", booking_id, profile_id)

    assert first.payment_id == second.payment_id
    # The gateway should only be asked about a payment id we haven't
    # already recorded.
    assert mock_fetch.call_count == 1


@patch("app.services.payment_service.MoyasarHelper.fetch_payment")
def test_confirm_payment_rejects_someone_elses_booking(mock_fetch, app):
    booking_id, _ = _seed_booking(app, Decimal("100.00"))
    mock_fetch.return_value = _moyasar_response(10000)

    other_customer = AuthService().register_customer({
        "full_name": "Sara Ahmed",
        "email": "sara@example.com",
        "password": "password123",
    })
    other_profile_id = other_customer["user_profile"]["user_profile_id"]

    with pytest.raises(ValueError):
        PaymentService().confirm_payment("pay_123", booking_id, other_profile_id)


@patch("app.services.payment_service.MoyasarHelper.fetch_payment")
def test_confirm_payment_rejects_a_tampered_amount(mock_fetch, app):
    booking_id, profile_id = _seed_booking(app, Decimal("100.00"))
    # Booking costs 100.00 SAR (10000 halalas) - gateway says only 1 SAR was paid.
    mock_fetch.return_value = _moyasar_response(100)

    with pytest.raises(ValueError):
        PaymentService().confirm_payment("pay_123", booking_id, profile_id)


@patch("app.services.payment_service.MoyasarHelper.fetch_payment")
def test_confirm_payment_rejects_a_payment_that_never_completed(mock_fetch, app):
    booking_id, profile_id = _seed_booking(app, Decimal("100.00"))
    mock_fetch.return_value = _moyasar_response(10000, status="failed")

    with pytest.raises(ValueError):
        PaymentService().confirm_payment("pay_123", booking_id, profile_id)


@patch("app.services.payment_service.MoyasarHelper.fetch_payment")
def test_a_demo_payment_is_rejected_when_demo_mode_is_off(mock_fetch, app):
    """The default. A demo id must not be a way past the gateway."""
    booking_id, profile_id = _seed_booking(app, Decimal("100.00"))
    app.config["PAYMENT_DEMO_MODE"] = False
    mock_fetch.side_effect = ValueError("Payment not found at the gateway.")

    with pytest.raises(ValueError):
        PaymentService().confirm_payment(
            "demo_1_123", booking_id, profile_id
        )


def test_a_demo_payment_is_accepted_for_the_booking_total_when_demo_mode_is_on(app):
    booking_id, profile_id = _seed_booking(app, Decimal("100.00"))
    app.config["PAYMENT_DEMO_MODE"] = True

    # No fetch_payment patch here on purpose: if the demo path ever stopped
    # short-circuiting, this test would try to reach Moyasar and fail loudly.
    payment = PaymentService().confirm_payment(
        "demo_1_123", booking_id, profile_id
    )

    # The amount comes from the booking, never from the caller.
    assert payment.amount == Decimal("100.00")
    assert payment.status == "paid"


def test_demo_mode_does_not_let_a_normal_gateway_id_skip_verification(app):
    """Only the demo_ prefix takes the bypass, even with demo mode on."""
    booking_id, profile_id = _seed_booking(app, Decimal("100.00"))
    app.config["PAYMENT_DEMO_MODE"] = True

    with patch(
        "app.services.payment_service.MoyasarHelper.fetch_payment"
    ) as mock_fetch:
        mock_fetch.side_effect = ValueError("Payment not found at the gateway.")

        with pytest.raises(ValueError):
            PaymentService().confirm_payment(
                "pay_not_a_demo", booking_id, profile_id
            )

        mock_fetch.assert_called_once()
