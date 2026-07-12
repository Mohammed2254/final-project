from flask import Blueprint, request
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
from app.utils.response_helper import ResponseHelper


wedding_plan_invitation_bp = Blueprint(
    "wedding_plan_invitations",
    __name__
)

invitation_service = WeddingPlanInvitationService()

create_schema = WeddingPlanInvitationCreateSchema()
accept_schema = WeddingPlanInvitationAcceptSchema()
reject_schema = WeddingPlanInvitationRejectSchema()
response_schema = WeddingPlanInvitationResponseSchema()
responses_schema = WeddingPlanInvitationResponseSchema(many=True)


@wedding_plan_invitation_bp.post("/")
def create_invitation():
    try:
        data = create_schema.load(request.get_json())

        invitation = invitation_service.create_invitation(
            plan_id=data["plan_id"],
            invited_email=data["invited_email"]
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


@wedding_plan_invitation_bp.get("/<int:invitation_id>")
def get_invitation(invitation_id):
    invitation = invitation_service.get_by_id(
        invitation_id
    )

    if invitation is None:
        return ResponseHelper.error(
            message="Invitation not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=response_schema.dump(invitation)
    )


@wedding_plan_invitation_bp.get("/code/<string:invite_code>")
def get_invitation_by_code(invite_code):
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
def get_invitations_by_plan(plan_id):
    invitations = invitation_service.get_by_plan_id(
        plan_id
    )

    return ResponseHelper.success(
        data=responses_schema.dump(invitations)
    )


@wedding_plan_invitation_bp.post("/accept")
def accept_invitation():
    try:
        data = accept_schema.load(request.get_json())

        invitation = invitation_service.accept_invitation(
            invite_code=data["invite_code"],
            accepted_by_profile_id=data[
                "accepted_by_profile_id"
            ]
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
def reject_invitation():
    try:
        data = reject_schema.load(request.get_json())

        invitation = invitation_service.reject_invitation(
            invite_code=data["invite_code"]
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
def delete_invitation(invitation_id):
    try:
        invitation_service.delete_invitation(
            invitation_id
        )

        return ResponseHelper.success(
            message="Invitation deleted successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )