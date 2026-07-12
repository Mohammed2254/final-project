from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.wedding_plan_selection_schema import (
    WeddingPlanSelectionCreateSchema,
    WeddingPlanSelectionUpdateSchema,
    WeddingPlanSelectionDeleteSchema,
    WeddingPlanSelectionResponseSchema
)
from app.services.wedding_plan_selection_service import (
    WeddingPlanSelectionService
)

from app.utils.response_helper import ResponseHelper


wedding_plan_selection_bp = Blueprint(
    "wedding_plan_selections",
    __name__
)

selection_service = WeddingPlanSelectionService()

create_schema = WeddingPlanSelectionCreateSchema()
update_schema = WeddingPlanSelectionUpdateSchema()
delete_schema = WeddingPlanSelectionDeleteSchema()
response_schema = WeddingPlanSelectionResponseSchema()
responses_schema = WeddingPlanSelectionResponseSchema(many=True)


@wedding_plan_selection_bp.post("/")
def add_service_to_plan():
    try:
        data = create_schema.load(request.get_json())

        plan_service = (
            selection_service.add_service_to_plan(
                plan_id=data["plan_id"],
                service_id=data["service_id"],
                added_by_profile_id=data[
                    "added_by_profile_id"
                ],
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
    "/<int:plan_service_id>"
)
def get_plan_service(plan_service_id):
    plan_service = selection_service.get_by_id(
        plan_service_id
    )

    if plan_service is None:
        return ResponseHelper.error(
            message="Wedding plan service not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=response_schema.dump(plan_service)
    )


@wedding_plan_selection_bp.get(
    "/plan/<int:plan_id>"
)
def get_services_by_plan(plan_id):
    plan_services = selection_service.get_by_plan_id(
        plan_id
    )

    return ResponseHelper.success(
        data=responses_schema.dump(plan_services)
    )


@wedding_plan_selection_bp.get(
    "/service/<int:service_id>"
)
def get_plans_by_service(service_id):
    plan_services = selection_service.get_by_service_id(
        service_id
    )

    return ResponseHelper.success(
        data=responses_schema.dump(plan_services)
    )


@wedding_plan_selection_bp.put(
    "/<int:plan_service_id>"
)
def update_plan_service(plan_service_id):
    try:
        data = update_schema.load(request.get_json())

        profile_id = data.pop("profile_id")

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


@wedding_plan_selection_bp.delete(
    "/<int:plan_service_id>"
)
def remove_service_from_plan(plan_service_id):
    try:
        data = delete_schema.load(request.get_json())

        selection_service.remove_service_from_plan(
            plan_service_id=plan_service_id,
            profile_id=data["profile_id"]
        )

        return ResponseHelper.success(
            message="Service removed from wedding plan successfully."
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