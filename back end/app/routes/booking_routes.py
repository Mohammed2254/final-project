from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.BookingItemSchema import (
    BookingCreateSchema,
    BookingUpdateSchema,
    BookingResponseSchema
)
from app.services.booking_service import BookingService
from app.utils.response_helper import ResponseHelper


booking_bp = Blueprint(
    "bookings",
    __name__
)

booking_service = BookingService()

create_schema = BookingCreateSchema()
update_schema = BookingUpdateSchema()
response_schema = BookingResponseSchema()
responses_schema = BookingResponseSchema(many=True)


@booking_bp.post("/")
def create_booking():
    try:
        data = create_schema.load(request.get_json())

        booking = booking_service.create_booking(
            customer_profile_id=data["customer_profile_id"],
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


@booking_bp.get("/")
def get_all_bookings():
    bookings = booking_service.get_all()

    return ResponseHelper.success(
        data=responses_schema.dump(bookings)
    )


@booking_bp.get("/<int:booking_id>")
def get_booking(booking_id):
    booking = booking_service.get_by_id(booking_id)

    if booking is None:
        return ResponseHelper.error(
            message="Booking not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=response_schema.dump(booking)
    )


@booking_bp.get("/customer/<int:customer_profile_id>")
def get_customer_bookings(customer_profile_id):
    bookings = booking_service.get_by_customer_id(
        customer_profile_id
    )

    return ResponseHelper.success(
        data=responses_schema.dump(bookings)
    )


@booking_bp.put("/<int:booking_id>")
def update_booking(booking_id):
    try:
        data = update_schema.load(request.get_json())

        booking = booking_service.update_booking(
            booking_id,
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


@booking_bp.delete("/<int:booking_id>")
def delete_booking(booking_id):
    try:
        booking_service.delete_booking(booking_id)

        return ResponseHelper.success(
            message="Booking deleted successfully."
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=404
        )