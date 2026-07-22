"""Unit tests for BookingService - focuses on total price calculation."""
from datetime import date
from decimal import Decimal

from app.extensions import db
from app.models.service_category import ServiceCategory
from app.services.auth_service import AuthService
from app.services.booking_service import BookingService
from app.services.service_service import ServiceService


def _seed_customer_and_service(app):
    """Create the minimum rows a booking needs: a customer profile and a
    service (which needs a provider profile and a category first)."""
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

    category = ServiceCategory(category_name="Halls")
    db.session.add(category)
    db.session.commit()

    service = ServiceService().create_service(
        provider_profile_id=provider["provider_profile"]["provider_profile_id"],
        category_id=category.category_id,
        service_name="Grand Ballroom",
        description=None,
        price=Decimal("5000.00"),
    )

    return customer["user_profile"]["user_profile_id"], service.service_id


def test_create_booking_sums_total_price(app):
    customer_profile_id, service_id = _seed_customer_and_service(app)

    booking = BookingService().create_booking(
        customer_profile_id=customer_profile_id,
        event_date=date(2026, 12, 1),
        items=[
            {"service_id": service_id, "quantity": 2,
             "price_at_booking": Decimal("5000.00")},
        ],
    )

    # 2 * 5000 = 10000
    assert booking.total_price == Decimal("10000.00")
    assert booking.status == "PENDING"


def test_create_booking_defaults_quantity_to_one(app):
    customer_profile_id, service_id = _seed_customer_and_service(app)

    booking = BookingService().create_booking(
        customer_profile_id=customer_profile_id,
        event_date=date(2026, 12, 1),
        items=[
            {"service_id": service_id,
             "price_at_booking": Decimal("5000.00")},
        ],
    )

    # No quantity given -> defaults to 1 -> total = 5000
    assert booking.total_price == Decimal("5000.00")
