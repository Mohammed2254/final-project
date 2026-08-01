"""Unit tests for BookingService.update_status_by_provider - the
reject-with-a-reason rule specifically."""
from datetime import date
from decimal import Decimal

from app.extensions import db
from app.models.service_category import ServiceCategory
from app.services.auth_service import AuthService
from app.services.booking_service import BookingService
from app.services.service_service import ServiceService


def _seed_booking(app):
    """A customer, a provider, one service, and a pending booking on it -
    returns (booking_id, provider_profile_id)."""
    auth = AuthService()

    customer = auth.register_customer({
        "full_name": "Nora Ali",
        "email": "nora@example.com",
        "password": "password123",
    })

    provider = auth.register_provider({
        "business_name": "Golden Hall",
        "phone_number": "0555000111",
        "email": "hall@example.com",
        "password": "password123",
    })
    provider_profile_id = provider["provider_profile"]["provider_profile_id"]

    category = ServiceCategory(category_name="Halls")
    db.session.add(category)
    db.session.commit()

    service = ServiceService().create_service(
        provider_profile_id=provider_profile_id,
        category_id=category.category_id,
        service_name="Grand Ballroom",
        description=None,
        price=Decimal("5000.00"),
    )

    booking = BookingService().create_booking(
        customer_profile_id=customer["user_profile"]["user_profile_id"],
        event_date=date(2026, 12, 1),
        items=[
            {"service_id": service.service_id, "quantity": 1,
             "price_at_booking": Decimal("5000.00")},
        ],
    )

    return booking.booking_id, provider_profile_id


def test_rejecting_without_a_reason_is_rejected(app):
    booking_id, provider_profile_id = _seed_booking(app)

    try:
        BookingService().update_status_by_provider(
            booking_id, provider_profile_id, "REJECTED"
        )
        assert False, "expected a ValueError"
    except ValueError as error:
        assert "reason" in str(error).lower()


def test_rejecting_with_a_blank_reason_is_rejected(app):
    booking_id, provider_profile_id = _seed_booking(app)

    try:
        BookingService().update_status_by_provider(
            booking_id, provider_profile_id, "REJECTED", "   "
        )
        assert False, "expected a ValueError"
    except ValueError as error:
        assert "reason" in str(error).lower()


def test_rejecting_with_a_reason_stores_it(app):
    booking_id, provider_profile_id = _seed_booking(app)

    booking = BookingService().update_status_by_provider(
        booking_id, provider_profile_id, "REJECTED", "Fully booked that date"
    )

    assert booking.status == "REJECTED"
    assert booking.rejection_reason == "Fully booked that date"


def test_confirming_does_not_require_a_reason(app):
    booking_id, provider_profile_id = _seed_booking(app)

    booking = BookingService().update_status_by_provider(
        booking_id, provider_profile_id, "CONFIRMED"
    )

    assert booking.status == "CONFIRMED"
    assert booking.rejection_reason is None


def test_confirming_after_a_rejection_clears_the_old_reason(app):
    booking_id, provider_profile_id = _seed_booking(app)

    BookingService().update_status_by_provider(
        booking_id, provider_profile_id, "REJECTED", "Fully booked"
    )
    booking = BookingService().update_status_by_provider(
        booking_id, provider_profile_id, "CONFIRMED"
    )

    assert booking.status == "CONFIRMED"
    assert booking.rejection_reason is None
