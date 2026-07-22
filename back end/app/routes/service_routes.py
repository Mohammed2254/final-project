from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.service_schema import (
    ServiceCreateSchema,
    ServiceUpdateSchema,
    ServiceResponseSchema
)

from app.services.service_service import ServiceService
from app.services.provider_profile_service import ProviderProfileService
from app.utils.jwt_helper import JwtHelper
from app.utils.response_helper import ResponseHelper


service_bp = Blueprint(
    "service",
    __name__
)

service_service = ServiceService()
provider_profile_service = ProviderProfileService()

service_create_schema = ServiceCreateSchema()
service_update_schema = ServiceUpdateSchema()

service_response_schema = ServiceResponseSchema()
services_response_schema = ServiceResponseSchema(many=True)


def _get_current_provider_profile_id():
    account_id = JwtHelper.get_account_id()
    provider_profile = provider_profile_service.get_by_account_id(account_id)

    if provider_profile is None:
        raise ValueError("Provider profile not found.")

    return provider_profile.provider_profile_id


def _assert_owns_service(service_id: int, provider_profile_id: int):
    service = service_service.get_by_id(service_id)

    if service is None:
        raise ValueError("Service not found.")

    if service.provider_profile_id != provider_profile_id:
        raise ValueError("You do not have access to this service.")


@service_bp.post("/")
@jwt_required()
def create_service():
    try:
        data = service_create_schema.load(request.get_json())

        # The owning provider comes from the authenticated token, never
        # from the request body - so a client can't create services on
        # behalf of another provider by sending a different id.
        provider_profile_id = _get_current_provider_profile_id()

        service = service_service.create_service(
            provider_profile_id=provider_profile_id,
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
@jwt_required()
def update_service(service_id):

    try:
        provider_profile_id = _get_current_provider_profile_id()
        _assert_owns_service(service_id, provider_profile_id)

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
@jwt_required()
def delete_service(service_id):

    try:
        provider_profile_id = _get_current_provider_profile_id()
        _assert_owns_service(service_id, provider_profile_id)

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
