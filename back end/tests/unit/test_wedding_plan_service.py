"""Unit tests for WeddingPlanService.delete_plan.

No test existed for this before - it was wired up on both ends (route +
service + cascading model relationships) but never actually exercised in
the test suite.
"""
from datetime import date
from decimal import Decimal

import pytest

from app.extensions import db
from app.models.service_category import ServiceCategory
from app.services.auth_service import AuthService
from app.services.service_service import ServiceService
from app.services.wedding_plan_service import WeddingPlanService
from app.services.wedding_plan_selection_service import (
    WeddingPlanSelectionService
)
from app.services.wedding_plan_invitation_service import (
    WeddingPlanInvitationService
)


def _seed(app):
    auth = AuthService()

    owner = auth.register_customer({
        "full_name": "Nora Ali",
        "email": "nora@example.com",
        "password": "password123",
    })
    outsider = auth.register_customer({
        "full_name": "Outsider",
        "email": "outsider@example.com",
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

    return (
        owner["user_profile"]["user_profile_id"],
        outsider["user_profile"]["user_profile_id"],
        service.service_id,
    )


def test_owner_can_delete_their_plan(app):
    owner_id, _, _ = _seed(app)
    plan_service = WeddingPlanService()
    plan = plan_service.create_plan(
        owner_profile_id=owner_id,
        plan_name="Our Wedding",
        event_date=date(2026, 12, 1),
        budget=Decimal("80000.00"),
    )

    plan_service.delete_plan(plan.plan_id, owner_id)

    assert plan_service.get_by_id(plan.plan_id) is None


def test_a_non_owner_cannot_delete_the_plan(app):
    owner_id, outsider_id, _ = _seed(app)
    plan_service = WeddingPlanService()
    plan = plan_service.create_plan(
        owner_profile_id=owner_id,
        plan_name="Our Wedding",
        event_date=date(2026, 12, 1),
        budget=Decimal("80000.00"),
    )

    with pytest.raises(ValueError, match="Only the plan owner"):
        plan_service.delete_plan(plan.plan_id, outsider_id)

    assert plan_service.get_by_id(plan.plan_id) is not None


def test_deleting_a_plan_cascades_to_its_invitation_and_selection(app):
    owner_id, _, service_id = _seed(app)
    plan_service = WeddingPlanService()
    plan = plan_service.create_plan(
        owner_profile_id=owner_id,
        plan_name="Our Wedding",
        event_date=date(2026, 12, 1),
        budget=Decimal("80000.00"),
    )

    invitation_service = WeddingPlanInvitationService()
    invitation = invitation_service.create_invitation(
        plan_id=plan.plan_id,
        invited_email="sara@example.com",
        profile_id=owner_id,
    )

    selection_service = WeddingPlanSelectionService()
    selection = selection_service.add_service_to_plan(
        plan_id=plan.plan_id,
        service_id=service_id,
        added_by_profile_id=owner_id,
        estimated_price=Decimal("5000.00"),
    )

    plan_service.delete_plan(plan.plan_id, owner_id)

    # The relationship cascade (cascade="all, delete-orphan" on WeddingPlan)
    # should have removed both children - not just the plan row itself.
    assert invitation_service.get_by_id(invitation.invitation_id) is None
    assert selection_service.get_by_id(selection.plan_service_id) is None
