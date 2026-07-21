from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.service_media_schema import (
    ServiceMediaCreateSchema,
    ServiceMediaUpdateSchema,
    ServiceMediaResponseSchema
)
from app.services.service_media_service import ServiceMediaService
from app.services.service_service import ServiceService
from app.services.provider_profile_service import ProviderProfileService
from app.utils.jwt_helper import JwtHelper
from app.utils.response_helper import ResponseHelper


service_media_bp = Blueprint(
    "service_media",
    __name__
)

service_media_service = ServiceMediaService()
service_service = ServiceService()
provider_profile_service = ProviderProfileService()

create_schema = ServiceMediaCreateSchema()
update_schema = ServiceMediaUpdateSchema()
response_schema = ServiceMediaResponseSchema()
responses_schema = ServiceMediaResponseSchema(many=True)


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


@service_media_bp.post("/")
@jwt_required()
def add_media():
    try:
        data = create_schema.load(request.get_json())

        provider_profile_id = _get_current_provider_profile_id()
        _assert_owns_service(data["service_id"], provider_profile_id)

        media = service_media_service.add_media(
            service_id=data["service_id"],
            media_url=data["media_url"],
            media_type=data.get("media_type", "IMAGE"),
            is_main=data.get("is_main", False)
        )

        return ResponseHelper.success(
            message="Media added successfully.",
            data=response_schema.dump(media),
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


@service_media_bp.get("/")
def get_all_media():
    media = service_media_service.get_all()

    return ResponseHelper.success(
        data=responses_schema.dump(media)
    )


@service_media_bp.get("/<int:media_id>")
def get_media(media_id):
    media = service_media_service.get_by_id(media_id)

    if media is None:
        return ResponseHelper.error(
            message="Media not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=response_schema.dump(media)
    )


@service_media_bp.get("/service/<int:service_id>")
def get_media_by_service(service_id):
    media = service_media_service.get_by_service_id(service_id)

    return ResponseHelper.success(
        data=responses_schema.dump(media)
    )


@service_media_bp.get("/service/<int:service_id>/main")
def get_main_media_by_service(service_id):
    media = service_media_service.get_main_by_service_id(service_id)

    if media is None:
        return ResponseHelper.error(
            message="Main media not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=response_schema.dump(media)
    )


@service_media_bp.put("/<int:media_id>")
@jwt_required()
def update_media(media_id):
    try:
        data = update_schema.load(request.get_json())

        provider_profile_id = _get_current_provider_profile_id()

        existing = service_media_service.get_by_id(media_id)
        if existing is None:
            return ResponseHelper.error(
                message="Media not found.",
                status_code=404
            )

        _assert_owns_service(existing.service_id, provider_profile_id)

        media = service_media_service.update_media(
            media_id,
            data
        )

        return ResponseHelper.success(
            message="Media updated successfully.",
            data=response_schema.dump(media)
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


@service_media_bp.delete("/<int:media_id>")
@jwt_required()
def delete_media(media_id):
    try:
        provider_profile_id = _get_current_provider_profile_id()

        existing = service_media_service.get_by_id(media_id)
        if existing is None:
            return ResponseHelper.error(
                message="Media not found.",
                status_code=404
            )

        _assert_owns_service(existing.service_id, provider_profile_id)

        service_media_service.delete_media(media_id)

        return ResponseHelper.success(
            message="Media deleted successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )