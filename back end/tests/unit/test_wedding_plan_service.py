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


def _plan_with_booked_service(app, event_date):
    """An owner + partner plan where one service made it all the way to
    BOOKED - returns (plan_service, owner_id, partner_id)."""
    owner_id, partner_id, service_id = _seed(app)

    plan_service = WeddingPlanService()
    plan = plan_service.create_plan(
        owner_profile_id=owner_id,
        plan_name="Our Wedding",
        event_date=event_date,
        budget=Decimal("80000.00"),
    )
    plan_service.set_partner(plan.plan_id, partner_id)

    selections = WeddingPlanSelectionService()
    selection = selections.add_service_to_plan(
        plan_id=plan.plan_id,
        service_id=service_id,
        added_by_profile_id=owner_id,
        estimated_price=Decimal("5000.00"),
    )
    selections.approve_selection(selection.plan_service_id, partner_id)
    selections.mark_as_booked(selection.plan_service_id, owner_id)

    return plan, owner_id, partner_id


def test_a_plan_with_a_booking_cannot_be_deleted_before_the_wedding(app):
    plan, owner_id, _ = _plan_with_booked_service(app, date(2026, 12, 1))

    with pytest.raises(ValueError, match="confirmed bookings"):
        WeddingPlanService().delete_plan(plan.plan_id, owner_id)


def test_the_same_plan_can_be_deleted_once_the_wedding_has_passed(app):
    plan, owner_id, _ = _plan_with_booked_service(app, date(2020, 1, 1))

    plan_service = WeddingPlanService()
    plan_service.delete_plan(plan.plan_id, owner_id)

    assert plan_service.get_by_id(plan.plan_id) is None


def test_a_plan_without_bookings_is_still_free_to_delete(app):
    owner_id, partner_id, service_id = _seed(app)
    plan_service = WeddingPlanService()
    plan = plan_service.create_plan(
        owner_profile_id=owner_id,
        plan_name="Our Wedding",
        event_date=date(2026, 12, 1),
        budget=Decimal("80000.00"),
    )
    plan_service.set_partner(plan.plan_id, partner_id)
    WeddingPlanSelectionService().add_service_to_plan(
        plan_id=plan.plan_id,
        service_id=service_id,
        added_by_profile_id=owner_id,
        estimated_price=Decimal("5000.00"),
    )

    plan_service.delete_plan(plan.plan_id, owner_id)

    assert plan_service.get_by_id(plan.plan_id) is None


def test_the_partner_can_leave_and_the_plan_becomes_solo_again(app):
    owner_id, partner_id, service_id = _seed(app)
    plan_service = WeddingPlanService()
    plan = plan_service.create_plan(
        owner_profile_id=owner_id,
        plan_name="Our Wedding",
        event_date=date(2026, 12, 1),
        budget=Decimal("80000.00"),
    )
    plan_service.set_partner(plan.plan_id, partner_id)

    selections = WeddingPlanSelectionService()
    # One choice each: the partner's is still pending, the owner's is agreed.
    partner_pick = selections.add_service_to_plan(
        plan_id=plan.plan_id, service_id=service_id,
        added_by_profile_id=partner_id, estimated_price=Decimal("5000.00"),
    )
    owner_pick = selections.add_service_to_plan(
        plan_id=plan.plan_id, service_id=service_id,
        added_by_profile_id=owner_id, estimated_price=Decimal("5000.00"),
    )
    selections.approve_selection(owner_pick.plan_service_id, partner_id)

    updated = plan_service.leave_plan(plan.plan_id, partner_id)

    assert updated.partner_profile_id is None
    # The partner's own pending pick leaves with them.
    assert selections.get_by_id(partner_pick.plan_service_id).status == "REJECTED"
    # What they already agreed on together stands.
    assert selections.get_by_id(owner_pick.plan_service_id).status == "APPROVED"


def test_the_owner_cannot_leave_their_own_plan(app):
    owner_id, partner_id, _ = _seed(app)
    plan_service = WeddingPlanService()
    plan = plan_service.create_plan(
        owner_profile_id=owner_id,
        plan_name="Our Wedding",
        event_date=date(2026, 12, 1),
        budget=Decimal("80000.00"),
    )
    plan_service.set_partner(plan.plan_id, partner_id)

    with pytest.raises(ValueError, match="Only the partner can leave"):
        plan_service.leave_plan(plan.plan_id, owner_id)
