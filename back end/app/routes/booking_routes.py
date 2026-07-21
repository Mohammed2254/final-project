from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.BookingItemSchema import (
    BookingCreateSchema,
    BookingUpdateSchema,
    BookingStatusUpdateSchema,
    BookingResponseSchema
)

from app.services.booking_service import BookingService
from app.services.user_profile_service import UserProfileService
from app.services.provider_profile_service import ProviderProfileService
from app.utils.jwt_helper import JwtHelper

from app.utils.response_helper import ResponseHelper


booking_bp = Blueprint(
    "bookings",
    __name__
)

booking_service = BookingService()
user_profile_service = UserProfileService()
provider_profile_service = ProviderProfileService()

create_schema = BookingCreateSchema()
update_schema = BookingUpdateSchema()
status_update_schema = BookingStatusUpdateSchema()
response_schema = BookingResponseSchema()
responses_schema = BookingResponseSchema(many=True)


def _get_current_user_profile_id():
    account_id = JwtHelper.get_account_id()
    user_profile = user_profile_service.get_by_account_id(account_id)

    if user_profile is None:
        raise ValueError("Customer profile not found.")

    return user_profile.user_profile_id


def _get_current_provider_profile_id():
    account_id = JwtHelper.get_account_id()
    provider_profile = provider_profile_service.get_by_account_id(account_id)

    if provider_profile is None:
        raise ValueError("Provider profile not found.")

    return provider_profile.provider_profile_id


@booking_bp.post("/")
@jwt_required()
def create_booking():
    try:
        data = create_schema.load(request.get_json())

        customer_profile_id = _get_current_user_profile_id()

        booking = booking_service.create_booking(
            customer_profile_id=customer_profile_id,
            event_date=data["event_date"],
            items=data["items"],
            notes=data.get("notes")
        )

        return ResponseHelper.success(
            message="Booking created successfully.",
            data=response_schema.dump(booking),
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


@booking_bp.get("/<int:booking_id>")
@jwt_required()
def get_booking(booking_id):
    booking = booking_service.get_by_id(booking_id)

    if booking is None:
        return ResponseHelper.error(
            message="Booking not found.",
            status_code=404
        )

    account_id = JwtHelper.get_account_id()
    user_profile = user_profile_service.get_by_account_id(account_id)
    provider_profile = provider_profile_service.get_by_account_id(account_id)

    is_customer = (
        user_profile is not None
        and booking.customer_profile_id == user_profile.user_profile_id
    )

    is_provider = (
        provider_profile is not None
        and booking_service.is_provider_booking(
            booking, provider_profile.provider_profile_id
        )
    )

    if not is_customer and not is_provider:
        return ResponseHelper.error(
            message="You do not have access to this booking.",
            status_code=403
        )

    return ResponseHelper.success(
        data=response_schema.dump(booking)
    )


@booking_bp.get("/customer/me")
@jwt_required()
def get_my_bookings():
    try:
        customer_profile_id = _get_current_user_profile_id()
    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )

    bookings = booking_service.get_by_customer_id(customer_profile_id)

    return ResponseHelper.success(
        data=responses_schema.dump(bookings)
    )


@booking_bp.get("/provider/me")
@jwt_required()
def get_provider_bookings():
    try:
        provider_profile_id = _get_current_provider_profile_id()
    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )

    bookings = booking_service.get_by_provider_id(provider_profile_id)

    return ResponseHelper.success(
        data=responses_schema.dump(bookings)
    )


@booking_bp.put("/<int:booking_id>")
@jwt_required()
def update_booking(booking_id):
    try:
        data = update_schema.load(request.get_json())

        customer_profile_id = _get_current_user_profile_id()

        booking = booking_service.update_booking_by_customer(
            booking_id,
            customer_profile_id,
            data
        )

        return ResponseHelper.success(
            message="Booking updated successfully.",
            data=response_schema.dump(booking)
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


@booking_bp.post("/<int:booking_id>/status")
@jwt_required()
def update_booking_status(booking_id):
    try:
        data = status_update_schema.load(request.get_json())

        provider_profile_id = _get_current_provider_profile_id()

        booking = booking_service.update_status_by_provider(
            booking_id,
            provider_profile_id,
            data["status"]
        )

        return ResponseHelper.success(
            message="Booking status updated successfully.",
            data=response_schema.dump(booking)
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


@booking_bp.delete("/<int:booking_id>")
@jwt_required()
def delete_booking(booking_id):
    try:
        customer_profile_id = _get_current_user_profile_id()

        booking_service.delete_booking(booking_id, customer_profile_id)

        return ResponseHelper.success(
            message="Booking deleted successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )