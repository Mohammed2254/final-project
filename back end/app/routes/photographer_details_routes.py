from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.photographer_details_schema import (
    PhotographerDetailsCreateSchema,
    PhotographerDetailsUpdateSchema,
    PhotographerDetailsResponseSchema
)
from app.services.photographer_details_service import PhotographerDetailsService
from app.utils.response_helper import ResponseHelper


photographer_bp = Blueprint(
    "photographer_details",
    __name__
)

photographer_service = PhotographerDetailsService()

create_schema = PhotographerDetailsCreateSchema()
update_schema = PhotographerDetailsUpdateSchema()
response_schema = PhotographerDetailsResponseSchema()
responses_schema = PhotographerDetailsResponseSchema(many=True)


@photographer_bp.post("/")
@jwt_required()
def create_photographer_details():
    try:
        data = create_schema.load(request.get_json())

        photographer = photographer_service.create_photographer_details(
            service_id=data["service_id"],
            coverage_hours=data["coverage_hours"],
            camera_type=data.get("camera_type"),
            has_video=data.get("has_video", False),
            has_drone=data.get("has_drone", False),
            portfolio_url=data.get("portfolio_url")
        )

        return ResponseHelper.success(
            message="Photographer details created successfully.",
            data=response_schema.dump(photographer),
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


@photographer_bp.get("/")
def get_all_photographers():
    photographers = photographer_service.get_all()

    return ResponseHelper.success(
        data=responses_schema.dump(photographers)
    )


@photographer_bp.get("/<int:photographer_details_id>")
def get_photographer_details(photographer_details_id):
    photographer = photographer_service.get_by_id(photographer_details_id)

    if photographer is None:
        return ResponseHelper.error(
            message="Photographer details not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=response_schema.dump(photographer)
    )


@photographer_bp.get("/service/<int:service_id>")
def get_photographer_by_service(service_id):
    photographer = photographer_service.get_by_service_id(service_id)

    if photographer is None:
        return ResponseHelper.error(
            message="Photographer details not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=response_schema.dump(photographer)
    )


@photographer_bp.put("/<int:photographer_details_id>")
@jwt_required()
def update_photographer_details(photographer_details_id):
    try:
        data = update_schema.load(request.get_json())

        photographer = photographer_service.update_photographer_details(
            photographer_details_id,
            data
        )

        return ResponseHelper.success(
            message="Photographer details updated successfully.",
            data=response_schema.dump(photographer)
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


@photographer_bp.delete("/<int:photographer_details_id>")
@jwt_required()
def delete_photographer_details(photographer_details_id):
    try:
        photographer_service.delete_photographer_details(
            photographer_details_id
        )

        return ResponseHelper.success(
            message="Photographer details deleted successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )