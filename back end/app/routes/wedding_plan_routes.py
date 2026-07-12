from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.wedding_plan_schema import (
    WeddingPlanCreateSchema,
    WeddingPlanUpdateSchema,
    WeddingPlanResponseSchema
)
from app.services.wedding_plan_service import WeddingPlanService
from app.utils.response_helper import ResponseHelper


wedding_plan_bp = Blueprint(
    "wedding_plans",
    __name__
)

wedding_plan_service = WeddingPlanService()

create_schema = WeddingPlanCreateSchema()
update_schema = WeddingPlanUpdateSchema()
response_schema = WeddingPlanResponseSchema()
responses_schema = WeddingPlanResponseSchema(many=True)


@wedding_plan_bp.post("/")
def create_wedding_plan():
    try:
        data = create_schema.load(request.get_json())

        plan = wedding_plan_service.create_plan(
            owner_profile_id=data["owner_profile_id"],
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


@wedding_plan_bp.get("/")
def get_all_wedding_plans():
    plans = wedding_plan_service.get_all()

    return ResponseHelper.success(
        data=responses_schema.dump(plans)
    )


@wedding_plan_bp.get("/<int:plan_id>")
def get_wedding_plan(plan_id):
    plan = wedding_plan_service.get_by_id(plan_id)

    if plan is None:
        return ResponseHelper.error(
            message="Wedding plan not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=response_schema.dump(plan)
    )


@wedding_plan_bp.get("/owner/<int:owner_profile_id>")
def get_wedding_plans_by_owner(owner_profile_id):
    plans = wedding_plan_service.get_by_owner(
        owner_profile_id
    )

    return ResponseHelper.success(
        data=responses_schema.dump(plans)
    )


@wedding_plan_bp.put("/<int:plan_id>")
def update_wedding_plan(plan_id):
    try:
        data = update_schema.load(request.get_json())

        plan = wedding_plan_service.update_plan(
            plan_id,
            data
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
def delete_wedding_plan(plan_id):
    try:
        wedding_plan_service.delete_plan(plan_id)

        return ResponseHelper.success(
            message="Wedding plan deleted successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )