from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.hall_details_schema import (
    HallDetailsCreateSchema,
    HallDetailsUpdateSchema,
    HallDetailsResponseSchema
)

from app.services.hall_details_service import HallDetailsService
from app.utils.response_helper import ResponseHelper


hall_bp = Blueprint(
    "hall_details",
    __name__
)

hall_service = HallDetailsService()

hall_create_schema = HallDetailsCreateSchema()
hall_update_schema = HallDetailsUpdateSchema()

hall_response_schema = HallDetailsResponseSchema()
halls_response_schema = HallDetailsResponseSchema(many=True)


@hall_bp.post("/")
def create_hall_details():
    try:
        data = hall_create_schema.load(request.get_json())

        hall = hall_service.create_hall_details(
            service_id=data["service_id"],
            min_capacity=data["min_capacity"],
            max_capacity=data["max_capacity"],
            city=data["city"],
            address=data["address"],
            latitude=data.get("latitude"),
            longitude=data.get("longitude")
        )

        return ResponseHelper.success(
            message="Hall details created successfully.",
            data=hall_response_schema.dump(hall),
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


@hall_bp.get("/")
def get_all_hall_details():
    halls = hall_service.get_all()

    return ResponseHelper.success(
        data=halls_response_schema.dump(halls)
    )


@hall_bp.get("/<int:hall_details_id>")
def get_hall_details(hall_details_id):

    hall = hall_service.get_by_id(hall_details_id)

    if hall is None:
        return ResponseHelper.error(
            message="Hall details not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=hall_response_schema.dump(hall)
    )


@hall_bp.get("/service/<int:service_id>")
def get_hall_by_service(service_id):

    hall = hall_service.get_by_service_id(service_id)

    if hall is None:
        return ResponseHelper.error(
            message="Hall details not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=hall_response_schema.dump(hall)
    )


@hall_bp.put("/<int:hall_details_id>")
def update_hall_details(hall_details_id):
    try:
        data = hall_update_schema.load(request.get_json())

        hall = hall_service.update_hall_details(
            hall_details_id,
            data
        )

        return ResponseHelper.success(
            message="Hall details updated successfully.",
            data=hall_response_schema.dump(hall)
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


@hall_bp.delete("/<int:hall_details_id>")
def delete_hall_details(hall_details_id):
    try:
        hall_service.delete_hall_details(hall_details_id)

        return ResponseHelper.success(
            message="Hall details deleted successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )