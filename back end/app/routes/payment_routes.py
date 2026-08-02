from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.payment_schema import (
    PaymentConfirmSchema,
    PaymentResponseSchema
)
from app.services.payment_service import PaymentService
from app.services.user_profile_service import UserProfileService
from app.utils.jwt_helper import JwtHelper
from app.utils.response_helper import ResponseHelper


payment_bp = Blueprint("payments", __name__)

payment_service = PaymentService()
user_profile_service = UserProfileService()

confirm_schema = PaymentConfirmSchema()
response_schema = PaymentResponseSchema()
responses_schema = PaymentResponseSchema(many=True)


def _get_current_user_profile_id():
    account_id = JwtHelper.get_account_id()
    user_profile = user_profile_service.get_by_account_id(account_id)

    if user_profile is None:
        raise ValueError("Customer profile not found.")

    return user_profile.user_profile_id


@payment_bp.post("/confirm")
@jwt_required()
def confirm_payment():
    try:
        data = confirm_schema.load(request.get_json())

        profile_id = _get_current_user_profile_id()

        payment = payment_service.confirm_payment(
            data["gateway_payment_id"],
            data["booking_id"],
            profile_id
        )

        return ResponseHelper.success(
            message="Payment confirmed successfully.",
            data=response_schema.dump(payment)
        )

    except ValidationError as error:
        return ResponseHelper.error(
            message="Validation error.",
            errors=error.messages,
            status_code=400
        )

    except ValueError as error:
        return ResponseHelper.error(
            message=str(error),
            status_code=400
        )


@payment_bp.get("/booking/<int:booking_id>")
@jwt_required()
def get_payments_for_booking(booking_id):
    payments = payment_service.get_by_booking_id(booking_id)

    return ResponseHelper.success(
        data=responses_schema.dump(payments)
    )
