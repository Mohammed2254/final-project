from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.wedding_plan_selection_schema import (
    WeddingPlanSelectionCreateSchema,
    WeddingPlanSelectionUpdateSchema,
    WeddingPlanSelectionResponseSchema
)
from app.services.wedding_plan_selection_service import (
    WeddingPlanSelectionService
)
from app.services.wedding_plan_service import WeddingPlanService
from app.services.user_profile_service import UserProfileService
from app.utils.jwt_helper import JwtHelper
from app.utils.response_helper import ResponseHelper


wedding_plan_selection_bp = Blueprint(
    "wedding_plan_selections",
    __name__
)

selection_service = WeddingPlanSelectionService()
plan_service = WeddingPlanService()
user_profile_service = UserProfileService()

create_schema = WeddingPlanSelectionCreateSchema()
update_schema = WeddingPlanSelectionUpdateSchema()
response_schema = WeddingPlanSelectionResponseSchema()
responses_schema = WeddingPlanSelectionResponseSchema(many=True)


def _get_current_user_profile_id():
    account_id = JwtHelper.get_account_id()
    user_profile = user_profile_service.get_by_account_id(account_id)

    if user_profile is None:
        raise ValueError("Customer profile not found.")

    return user_profile.user_profile_id


@wedding_plan_selection_bp.post("/")
@jwt_required()
def add_service_to_plan():
    try:
        data = create_schema.load(request.get_json())

        added_by_profile_id = _get_current_user_profile_id()

        plan_service = (
            selection_service.add_service_to_plan(
                plan_id=data["plan_id"],
                service_id=data["service_id"],
                added_by_profile_id=added_by_profile_id,
                estimated_price=data[
                    "estimated_price"
                ],
                notes=data.get("notes")
            )
        )

        return ResponseHelper.success(
            message="Service added to wedding plan successfully.",
            data=response_schema.dump(plan_service),
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


@wedding_plan_selection_bp.get(
    "/plan/<int:plan_id>"
)
@jwt_required()
def get_services_by_plan(plan_id):
    plan = plan_service.get_by_id(plan_id)

    if plan is None:
        return ResponseHelper.error(
            message="Wedding plan not found.",
            status_code=404
        )

    try:
        profile_id = _get_current_user_profile_id()
    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )

    if profile_id not in {plan.owner_profile_id, plan.partner_profile_id}:
        return ResponseHelper.error(
            message="You do not have access to this wedding plan.",
            status_code=403
        )

    plan_services = selection_service.get_by_plan_id(
        plan_id
    )

    return ResponseHelper.success(
        data=responses_schema.dump(plan_services)
    )


@wedding_plan_selection_bp.put(
    "/<int:plan_service_id>"
)
@jwt_required()
def update_plan_service(plan_service_id):
    try:
        data = update_schema.load(request.get_json())

        profile_id = _get_current_user_profile_id()

        plan_service = (
            selection_service.update_plan_service(
                plan_service_id=plan_service_id,
                data=data,
                profile_id=profile_id
            )
        )

        return ResponseHelper.success(
            message="Wedding plan service updated successfully.",
            data=response_schema.dump(plan_service)
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


@wedding_plan_selection_bp.post(
    "/<int:plan_service_id>/approve"
)
@jwt_required()
def approve_plan_service(plan_service_id):
    try:
        profile_id = _get_current_user_profile_id()

        plan_service = selection_service.approve_selection(
            plan_service_id=plan_service_id,
            profile_id=profile_id
        )

        return ResponseHelper.success(
            message="Service approved successfully.",
            data=response_schema.dump(plan_service)
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=400
        )


@wedding_plan_selection_bp.post(
    "/<int:plan_service_id>/reject"
)
@jwt_required()
def reject_plan_service(plan_service_id):
    try:
        profile_id = _get_current_user_profile_id()

        plan_service = selection_service.reject_selection(
            plan_service_id=plan_service_id,
            profile_id=profile_id
        )

        return ResponseHelper.success(
            message="Service rejected successfully.",
            data=response_schema.dump(plan_service)
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=400
        )


@wedding_plan_selection_bp.delete(
    "/<int:plan_service_id>"
)
@jwt_required()
def remove_service_from_plan(plan_service_id):
    try:
        profile_id = _get_current_user_profile_id()

        selection_service.remove_service_from_plan(
            plan_service_id=plan_service_id,
            profile_id=profile_id
        )

        return ResponseHelper.success(
            message="Service removed from wedding plan successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=400
        )
