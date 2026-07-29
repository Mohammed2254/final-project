"""Unit tests for wedding plan invitations.

Covers a real bug: re-sending an invite used to always create a brand new
row with a brand new code, silently orphaning any code already shared with
the partner (the frontend's "the code keeps changing" complaint).
"""
from datetime import date
from decimal import Decimal

import pytest

from app.services.auth_service import AuthService
from app.services.wedding_plan_service import WeddingPlanService
from app.services.wedding_plan_invitation_service import (
    WeddingPlanInvitationService
)


def _seed(app):
    """Create a plan owner with a plan, ready to invite a partner."""
    auth = AuthService()

    owner = auth.register_customer({
        "full_name": "Nora Ali",
        "email": "nora@example.com",
        "password": "password123",
    })

    owner_id = owner["user_profile"]["user_profile_id"]

    plan = WeddingPlanService().create_plan(
        owner_profile_id=owner_id,
        plan_name="Our Wedding",
        event_date=date(2026, 12, 1),
        budget=Decimal("80000.00"),
    )

    return owner_id, plan.plan_id


def test_create_invitation_returns_a_code(app):
    owner_id, plan_id = _seed(app)

    invitation = WeddingPlanInvitationService().create_invitation(
        plan_id=plan_id,
        invited_email="sara@example.com",
        profile_id=owner_id,
    )

    assert invitation.invite_code
    assert invitation.invited_email == "sara@example.com"
    assert invitation.status == "PENDING"


def test_reinviting_the_same_email_reuses_the_existing_code(app):
    owner_id, plan_id = _seed(app)
    service = WeddingPlanInvitationService()

    first = service.create_invitation(
        plan_id=plan_id, invited_email="sara@example.com", profile_id=owner_id,
    )
    second = service.create_invitation(
        plan_id=plan_id, invited_email="sara@example.com", profile_id=owner_id,
    )

    assert second.invite_code == first.invite_code
    assert second.invitation_id == first.invitation_id


def test_reinviting_a_different_email_issues_a_new_code(app):
    owner_id, plan_id = _seed(app)
    service = WeddingPlanInvitationService()

    first = service.create_invitation(
        plan_id=plan_id, invited_email="sara@example.com", profile_id=owner_id,
    )
    second = service.create_invitation(
        plan_id=plan_id, invited_email="different@example.com", profile_id=owner_id,
    )

    assert second.invite_code != first.invite_code
    assert second.invited_email == "different@example.com"

    # The stale invitation for the wrong email should not still be sitting
    # in the database, acceptable by nobody but taking up a row forever.
    assert service.get_by_code(first.invite_code) is None


def test_only_the_plan_owner_can_invite_a_partner(app):
    _, plan_id = _seed(app)
    outsider = AuthService().register_customer({
        "full_name": "Outsider",
        "email": "outsider@example.com",
        "password": "password123",
    })
    outsider_id = outsider["user_profile"]["user_profile_id"]

    with pytest.raises(ValueError, match="Only the plan owner"):
        WeddingPlanInvitationService().create_invitation(
            plan_id=plan_id,
            invited_email="sara@example.com",
            profile_id=outsider_id,
        )
