from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.service_schema import (
    ServiceCreateSchema,
    ServiceUpdateSchema,
    ServiceResponseSchema
)

from app.services.service_service import ServiceService
from app.utils.response_helper import ResponseHelper


service_bp = Blueprint(
    "service",
    __name__
)

service_service = ServiceService()

service_create_schema = ServiceCreateSchema()
service_update_schema = ServiceUpdateSchema()

service_response_schema = ServiceResponseSchema()
services_response_schema = ServiceResponseSchema(many=True)


@service_bp.post("/")
def create_service():
    try:
        data = service_create_schema.load(request.get_json())

        service = service_service.create_service(
            provider_profile_id=data["provider_profile_id"],
            category_id=data["category_id"],
            service_name=data["service_name"],
            description=data.get("description"),
            price=data["price"]
        )

        return ResponseHelper.success(
            message="Service created successfully.",
            data=service_response_schema.dump(service),
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


@service_bp.get("/")
def get_all_services():

    services = service_service.get_all_active()

    return ResponseHelper.success(
        data=services_response_schema.dump(services)
    )


@service_bp.get("/<int:service_id>")
def get_service(service_id):

    service = service_service.get_by_id(service_id)

    if service is None:
        return ResponseHelper.error(
            message="Service not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=service_response_schema.dump(service)
    )


@service_bp.put("/<int:service_id>")
def update_service(service_id):

    try:
        data = service_update_schema.load(request.get_json())

        service = service_service.update_service(
            service_id=service_id,
            service_name=data.get("service_name"),
            description=data.get("description"),
            price=data.get("price"),
            category_id=data.get("category_id")
        )

        return ResponseHelper.success(
            message="Service updated successfully.",
            data=service_response_schema.dump(service)
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


@service_bp.delete("/<int:service_id>")
def delete_service(service_id):

    try:
        service = service_service.deactivate_service(service_id)

        return ResponseHelper.success(
            message="Service deactivated successfully.",
            data=service_response_schema.dump(service)
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )


@service_bp.get("/provider/<int:provider_profile_id>")
def get_provider_services(provider_profile_id):

    services = service_service.get_by_provider_id(
        provider_profile_id
    )

    return ResponseHelper.success(
        data=services_response_schema.dump(services)
    )


@service_bp.get("/category/<int:category_id>")
def get_category_services(category_id):

    services = service_service.get_by_category_id(
        category_id
    )

    return ResponseHelper.success(
        data=services_response_schema.dump(services)
    )


@service_bp.get("/search")
def search_services():

    keyword = request.args.get("keyword", "")

    services = service_service.search_by_name(keyword)

    return ResponseHelper.success(
        data=services_response_schema.dump(services)
    )
