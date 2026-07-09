from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.service_media_schema import (
    ServiceMediaCreateSchema,
    ServiceMediaUpdateSchema,
    ServiceMediaResponseSchema
)
from app.services.service_media_service import ServiceMediaService
from app.utils.response_helper import ResponseHelper


service_media_bp = Blueprint(
    "service_media",
    __name__
)

service_media_service = ServiceMediaService()

create_schema = ServiceMediaCreateSchema()
update_schema = ServiceMediaUpdateSchema()
response_schema = ServiceMediaResponseSchema()
responses_schema = ServiceMediaResponseSchema(many=True)


@service_media_bp.post("/")
def add_media():
    try:
        data = create_schema.load(request.get_json())

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
def update_media(media_id):
    try:
        data = update_schema.load(request.get_json())

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
def delete_media(media_id):
    try:
        service_media_service.delete_media(media_id)

        return ResponseHelper.success(
            message="Media deleted successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )