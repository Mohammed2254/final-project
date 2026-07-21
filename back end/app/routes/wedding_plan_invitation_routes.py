from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.wedding_plan_invitation_schema import (
    WeddingPlanInvitationCreateSchema,
    WeddingPlanInvitationAcceptSchema,
    WeddingPlanInvitationRejectSchema,
    WeddingPlanInvitationResponseSchema
)

from app.services.wedding_plan_invitation_service import (
    WeddingPlanInvitationService
)
from app.services.account_service import AccountService
from app.services.user_profile_service import UserProfileService
from app.utils.jwt_helper import JwtHelper
from app.utils.response_helper import ResponseHelper


wedding_plan_invitation_bp = Blueprint(
    "wedding_plan_invitations",
    __name__
)

invitation_service = WeddingPlanInvitationService()
account_service = AccountService()
user_profile_service = UserProfileService()

create_schema = WeddingPlanInvitationCreateSchema()
accept_schema = WeddingPlanInvitationAcceptSchema()
reject_schema = WeddingPlanInvitationRejectSchema()
response_schema = WeddingPlanInvitationResponseSchema()
responses_schema = WeddingPlanInvitationResponseSchema(many=True)


def _get_current_user_profile_id():
    account_id = JwtHelper.get_account_id()
    user_profile = user_profile_service.get_by_account_id(account_id)

    if user_profile is None:
        raise ValueError("Customer profile not found.")

    return user_profile.user_profile_id


def _get_current_account_email():
    account_id = JwtHelper.get_account_id()
    account = account_service.get_by_id(account_id)

    if account is None:
        raise ValueError("Account not found.")

    return account.email


@wedding_plan_invitation_bp.post("/")
@jwt_required()
def create_invitation():
    try:
        data = create_schema.load(request.get_json())

        profile_id = _get_current_user_profile_id()

        invitation = invitation_service.create_invitation(
            plan_id=data["plan_id"],
            invited_email=data["invited_email"],
            profile_id=profile_id
        )

        return ResponseHelper.success(
            message="Invitation created successfully.",
            data=response_schema.dump(invitation),
            status_code=201
        )

    except ValidationError as error:
        return ResponseHelper.error(
            message="Validation failed.",
            errors=error.messages,
            status_code=400
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=400
        )


@wedding_plan_invitation_bp.get("/code/<string:invite_code>")
def get_invitation_by_code(invite_code):
    # Intentionally public: the invite_code itself is an unguessable bearer
    # token, so a recipient can preview the invitation before signing in.
    invitation = invitation_service.get_by_code(
        invite_code
    )

    if invitation is None:
        return ResponseHelper.error(
            message="Invitation not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=response_schema.dump(invitation)
    )


@wedding_plan_invitation_bp.get("/plan/<int:plan_id>")
@jwt_required()
def get_invitations_by_plan(plan_id):
    try:
        profile_id = _get_current_user_profile_id()
    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )

    invitations = invitation_service.get_by_plan_id(plan_id)

    if invitations and invitations[0].plan.owner_profile_id != profile_id:
        return ResponseHelper.error(
            message="Only the plan owner can view its invitations.",
            status_code=403
        )

    return ResponseHelper.success(
        data=responses_schema.dump(invitations)
    )


@wedding_plan_invitation_bp.post("/accept")
@jwt_required()
def accept_invitation():
    try:
        data = accept_schema.load(request.get_json())

        profile_id = _get_current_user_profile_id()
        account_email = _get_current_account_email()

        invitation = invitation_service.accept_invitation(
            invite_code=data["invite_code"],
            accepted_by_profile_id=profile_id,
            account_email=account_email
        )

        return ResponseHelper.success(
            message="Invitation accepted successfully.",
            data=response_schema.dump(invitation)
        )

    except ValidationError as error:
        return ResponseHelper.error(
            message="Validation failed.",
            errors=error.messages,
            status_code=400
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=400
        )


@wedding_plan_invitation_bp.post("/reject")
@jwt_required()
def reject_invitation():
    try:
        data = reject_schema.load(request.get_json())

        account_email = _get_current_account_email()

        invitation = invitation_service.reject_invitation(
            invite_code=data["invite_code"],
            account_email=account_email
        )

        return ResponseHelper.success(
            message="Invitation rejected successfully.",
            data=response_schema.dump(invitation)
        )

    except ValidationError as error:
        return ResponseHelper.error(
            message="Validation failed.",
            errors=error.messages,
            status_code=400
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=400
        )


@wedding_plan_invitation_bp.delete(
    "/<int:invitation_id>"
)
@jwt_required()
def delete_invitation(invitation_id):
    try:
        profile_id = _get_current_user_profile_id()

        invitation_service.delete_invitation(
            invitation_id,
            profile_id
        )

        return ResponseHelper.success(
            message="Invitation deleted successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )