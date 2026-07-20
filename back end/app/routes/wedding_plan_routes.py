from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.wedding_plan_schema import (
    WeddingPlanCreateSchema,
    WeddingPlanUpdateSchema,
    WeddingPlanResponseSchema
)
from app.services.wedding_plan_service import WeddingPlanService
from app.services.user_profile_service import UserProfileService
from app.utils.jwt_helper import JwtHelper
from app.utils.response_helper import ResponseHelper


wedding_plan_bp = Blueprint(
    "wedding_plans",
    __name__
)

wedding_plan_service = WeddingPlanService()
user_profile_service = UserProfileService()

create_schema = WeddingPlanCreateSchema()
update_schema = WeddingPlanUpdateSchema()
response_schema = WeddingPlanResponseSchema()
responses_schema = WeddingPlanResponseSchema(many=True)


def _get_current_user_profile_id():
    account_id = JwtHelper.get_account_id()
    user_profile = user_profile_service.get_by_account_id(account_id)

    if user_profile is None:
        raise ValueError("Customer profile not found.")

    return user_profile.user_profile_id


@wedding_plan_bp.post("/")
@jwt_required()
def create_wedding_plan():
    try:
        data = create_schema.load(request.get_json())

        owner_profile_id = _get_current_user_profile_id()

        plan = wedding_plan_service.create_plan(
            owner_profile_id=owner_profile_id,
            plan_name=data["plan_name"],
            event_date=data["event_date"],
            budget=data["budget"],
            notes=data.get("notes")
        )

        return ResponseHelper.success(
            message="Wedding plan created successfully.",
            data=response_schema.dump(plan),
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


@wedding_plan_bp.get("/me")
@jwt_required()
def get_my_wedding_plans():
    try:
        profile_id = _get_current_user_profile_id()
    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )

    plans = wedding_plan_service.get_by_member(profile_id)

    return ResponseHelper.success(
        data=responses_schema.dump(plans)
    )


@wedding_plan_bp.get("/<int:plan_id>")
@jwt_required()
def get_wedding_plan(plan_id):
    plan = wedding_plan_service.get_by_id(plan_id)

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

    return ResponseHelper.success(
        data=response_schema.dump(plan)
    )


@wedding_plan_bp.put("/<int:plan_id>")
@jwt_required()
def update_wedding_plan(plan_id):
    try:
        data = update_schema.load(request.get_json())

        profile_id = _get_current_user_profile_id()

        plan = wedding_plan_service.update_plan(
            plan_id,
            data,
            profile_id
        )

        return ResponseHelper.success(
            message="Wedding plan updated successfully.",
            data=response_schema.dump(plan)
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
            status_code=404
        )


@wedding_plan_bp.delete("/<int:plan_id>")
@jwt_required()
def delete_wedding_plan(plan_id):
    try:
        profile_id = _get_current_user_profile_id()

        wedding_plan_service.delete_plan(plan_id, profile_id)

        return ResponseHelper.success(
            message="Wedding plan deleted successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )