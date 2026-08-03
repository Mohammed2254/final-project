"""The backend's own guard rails.

Every case here is reachable without a browser - curl, Postman, a script -
so the Zod rules on the forms cannot be what stops them.
"""
from datetime import date, timedelta

import pytest
from marshmallow import ValidationError

from app.schemas.wedding_plan_schema import WeddingPlanCreateSchema
from app.schemas.wedding_plan_selection_schema import (
    WeddingPlanSelectionCreateSchema
)
from app.schemas.BookingItemSchema import BookingItemSchema
from app.schemas.service_schema import ServiceCreateSchema


FUTURE = (date.today() + timedelta(days=30)).isoformat()


def _plan(**overrides):
    return {
        "plan_name": "Our Wedding",
        "event_date": FUTURE,
        "budget": "50000",
        **overrides,
    }


@pytest.mark.parametrize("budget", ["-5000", "0"])
def test_a_plan_budget_must_be_positive(budget):
    with pytest.raises(ValidationError) as error:
        WeddingPlanCreateSchema().load(_plan(budget=budget))

    assert "budget" in error.value.messages


def test_a_wedding_cannot_be_planned_for_a_past_date():
    with pytest.raises(ValidationError) as error:
        WeddingPlanCreateSchema().load(_plan(event_date="2020-01-01"))

    assert "event_date" in error.value.messages


def test_a_plan_name_needs_more_than_one_character():
    with pytest.raises(ValidationError) as error:
        WeddingPlanCreateSchema().load(_plan(plan_name="x"))

    assert "plan_name" in error.value.messages


def test_a_valid_plan_still_loads():
    assert WeddingPlanCreateSchema().load(_plan())["plan_name"] == "Our Wedding"


def test_a_selection_price_must_be_positive():
    with pytest.raises(ValidationError):
        WeddingPlanSelectionCreateSchema().load({
            "plan_id": 1,
            "service_id": 1,
            "estimated_price": "-1",
        })


def test_a_booking_item_cannot_have_zero_quantity():
    with pytest.raises(ValidationError):
        BookingItemSchema().load({
            "service_id": 1,
            "quantity": 0,
            "price_at_booking": "100",
        })


def test_a_service_price_must_be_positive():
    with pytest.raises(ValidationError):
        ServiceCreateSchema().load({
            "provider_profile_id": 1,
            "category_id": 1,
            "service_name": "Hall",
            "price": "0",
        })


def test_the_schema_refuses_a_field_it_does_not_declare():
    """Sending owner_profile_id by hand must not be able to set it -
    identity comes from the JWT, never from the request body."""
    with pytest.raises(ValidationError) as error:
        WeddingPlanCreateSchema().load(_plan(owner_profile_id=999))

    assert "owner_profile_id" in error.value.messages
