"""Unit tests for the shared wedding plan flow.

This covers the project's key differentiator: two partners planning
together, where a selection made in a shared plan waits for the other
partner's approval.
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


def _seed(app):
    """Create two customers (owner + partner) and one bookable service."""
    auth = AuthService()

    owner = auth.register_customer({
        "full_name": "Nora Ali",
        "email": "nora@example.com",
        "password": "password123",
    })

    partner = auth.register_customer({
        "full_name": "Sara Ahmed",
        "email": "sara@example.com",
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
        partner["user_profile"]["user_profile_id"],
        service.service_id,
    )


def _create_plan(owner_id):
    return WeddingPlanService().create_plan(
        owner_profile_id=owner_id,
        plan_name="Our Wedding",
        event_date=date(2026, 12, 1),
        budget=Decimal("80000.00"),
    )


def test_solo_plan_auto_approves_a_selection(app):
    owner_id, _, service_id = _seed(app)
    plan = _create_plan(owner_id)

    selection = WeddingPlanSelectionService().add_service_to_plan(
        plan_id=plan.plan_id,
        service_id=service_id,
        added_by_profile_id=owner_id,
        estimated_price=Decimal("5000.00"),
    )

    # No partner means nobody is left to approve the choice.
    assert selection.status == "APPROVED"


def test_shared_plan_selection_waits_for_partner_approval(app):
    owner_id, partner_id, service_id = _seed(app)
    plan = _create_plan(owner_id)
    WeddingPlanService().set_partner(plan.plan_id, partner_id)

    selection = WeddingPlanSelectionService().add_service_to_plan(
        plan_id=plan.plan_id,
        service_id=service_id,
        added_by_profile_id=owner_id,
        estimated_price=Decimal("5000.00"),
    )

    assert selection.status == "PENDING"


def test_partner_can_approve_a_pending_selection(app):
    owner_id, partner_id, service_id = _seed(app)
    plan = _create_plan(owner_id)
    WeddingPlanService().set_partner(plan.plan_id, partner_id)

    selection_service = WeddingPlanSelectionService()
    selection = selection_service.add_service_to_plan(
        plan_id=plan.plan_id,
        service_id=service_id,
        added_by_profile_id=owner_id,
        estimated_price=Decimal("5000.00"),
    )

    approved = selection_service.approve_selection(
        selection.plan_service_id, partner_id
    )

    assert approved.status == "APPROVED"


def test_partner_can_reject_a_pending_selection(app):
    owner_id, partner_id, service_id = _seed(app)
    plan = _create_plan(owner_id)
    WeddingPlanService().set_partner(plan.plan_id, partner_id)

    selection_service = WeddingPlanSelectionService()
    selection = selection_service.add_service_to_plan(
        plan_id=plan.plan_id,
        service_id=service_id,
        added_by_profile_id=owner_id,
        estimated_price=Decimal("5000.00"),
    )

    rejected = selection_service.reject_selection(
        selection.plan_service_id, partner_id
    )

    assert rejected.status == "REJECTED"


def test_a_non_member_cannot_add_a_service_to_the_plan(app):
    owner_id, outsider_id, service_id = _seed(app)
    plan = _create_plan(owner_id)

    # outsider_id was never added as this plan's partner.
    with pytest.raises(ValueError, match="Only wedding plan members"):
        WeddingPlanSelectionService().add_service_to_plan(
            plan_id=plan.plan_id,
            service_id=service_id,
            added_by_profile_id=outsider_id,
            estimated_price=Decimal("5000.00"),
        )


def test_the_owner_cannot_join_their_own_plan_as_partner(app):
    owner_id, _, _ = _seed(app)
    plan = _create_plan(owner_id)

    with pytest.raises(ValueError, match="owner cannot join as the partner"):
        WeddingPlanService().set_partner(plan.plan_id, owner_id)


def test_a_plan_cannot_have_two_partners(app):
    owner_id, partner_id, _ = _seed(app)
    plan = _create_plan(owner_id)
    plan_service = WeddingPlanService()
    plan_service.set_partner(plan.plan_id, partner_id)

    with pytest.raises(ValueError, match="already has a partner"):
        plan_service.set_partner(plan.plan_id, owner_id)


def test_only_the_adder_can_remove_a_selection(app):
    owner_id, partner_id, service_id = _seed(app)
    plan = _create_plan(owner_id)
    WeddingPlanService().set_partner(plan.plan_id, partner_id)

    selection_service = WeddingPlanSelectionService()
    selection = selection_service.add_service_to_plan(
        plan_id=plan.plan_id,
        service_id=service_id,
        added_by_profile_id=owner_id,
        estimated_price=Decimal("5000.00"),
    )

    # The partner disagrees - they must reject it, not delete owner's choice.
    with pytest.raises(ValueError, match="Only the member who added"):
        selection_service.remove_service_from_plan(
            selection.plan_service_id, partner_id
        )

    # The one who added it can still remove it themselves.
    assert selection_service.remove_service_from_plan(
        selection.plan_service_id, owner_id
    ) is True


def test_either_member_can_mark_an_approved_selection_as_booked(app):
    owner_id, partner_id, service_id = _seed(app)
    plan = _create_plan(owner_id)
    WeddingPlanService().set_partner(plan.plan_id, partner_id)

    selection_service = WeddingPlanSelectionService()
    selection = selection_service.add_service_to_plan(
        plan_id=plan.plan_id,
        service_id=service_id,
        added_by_profile_id=owner_id,
        estimated_price=Decimal("5000.00"),
    )
    selection_service.approve_selection(selection.plan_service_id, partner_id)

    # Booking is a consequence of the agreement, not a review - the adder
    # (owner_id) can trigger it too, unlike approve/reject.
    booked = selection_service.mark_as_booked(selection.plan_service_id, owner_id)

    assert booked.status == "BOOKED"


def test_a_pending_selection_cannot_be_booked(app):
    owner_id, partner_id, service_id = _seed(app)
    plan = _create_plan(owner_id)
    WeddingPlanService().set_partner(plan.plan_id, partner_id)

    selection_service = WeddingPlanSelectionService()
    selection = selection_service.add_service_to_plan(
        plan_id=plan.plan_id,
        service_id=service_id,
        added_by_profile_id=owner_id,
        estimated_price=Decimal("5000.00"),
    )

    with pytest.raises(ValueError, match="Only approved services can be booked"):
        selection_service.mark_as_booked(selection.plan_service_id, owner_id)
