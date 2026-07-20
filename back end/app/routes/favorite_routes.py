from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.favorite_schema import (
    FavoriteCreateSchema,
    FavoriteResponseSchema
)
from app.services.favorite_service import FavoriteService
from app.services.user_profile_service import UserProfileService
from app.utils.jwt_helper import JwtHelper
from app.utils.response_helper import ResponseHelper


favorite_bp = Blueprint(
    "favorites",
    __name__
)

favorite_service = FavoriteService()
user_profile_service = UserProfileService()

create_schema = FavoriteCreateSchema()
response_schema = FavoriteResponseSchema()
responses_schema = FavoriteResponseSchema(many=True)


def _get_current_user_profile_id():
    account_id = JwtHelper.get_account_id()
    user_profile = user_profile_service.get_by_account_id(account_id)

    if user_profile is None:
        raise ValueError("Customer profile not found.")

    return user_profile.user_profile_id


@favorite_bp.post("/")
@jwt_required()
def add_favorite():
    try:
        data = create_schema.load(request.get_json())

        user_profile_id = _get_current_user_profile_id()

        favorite = favorite_service.add_favorite(
            user_profile_id=user_profile_id,
            service_id=data["service_id"]
        )

        return ResponseHelper.success(
            message="Service added to favorites successfully.",
            data=response_schema.dump(favorite),
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


@favorite_bp.get("/")
@jwt_required()
def get_my_favorites():
    try:
        user_profile_id = _get_current_user_profile_id()
    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )

    favorites = favorite_service.get_by_user_id(user_profile_id)

    return ResponseHelper.success(
        data=responses_schema.dump(favorites)
    )


@favorite_bp.delete("/<int:service_id>")
@jwt_required()
def remove_favorite(service_id):
    try:
        user_profile_id = _get_current_user_profile_id()

        favorite_service.remove_favorite(
            user_profile_id=user_profile_id,
            service_id=service_id
        )

        return ResponseHelper.success(
            message="Service removed from favorites successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )
