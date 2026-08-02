from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.auth_schema import (
    CustomerRegisterSchema,
    ProviderRegisterSchema,
    LoginSchema,
    ForgotPasswordSchema,
    ResetPasswordSchema
)

from app.services.auth_service import AuthService
from app.utils.response_helper import ResponseHelper

auth_bp = Blueprint("auth", __name__)

auth_service = AuthService()

customer_register_schema = CustomerRegisterSchema()
provider_register_schema = ProviderRegisterSchema()
login_schema = LoginSchema()
forgot_password_schema = ForgotPasswordSchema()
reset_password_schema = ResetPasswordSchema()


@auth_bp.post("/register/customer")
def register_customer():
    try:
        data = customer_register_schema.load(request.get_json())

        result = auth_service.register_customer(data)

        return ResponseHelper.success(
            message="Customer registered successfully.",
            data=result,
            status_code=201
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
            status_code=409
        )


@auth_bp.post("/register/provider")
def register_provider():
    try:
        data = provider_register_schema.load(request.get_json())

        result = auth_service.register_provider(data)

        return ResponseHelper.success(
            message="Provider registered successfully.",
            data=result,
            status_code=201
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
            status_code=409
        )


@auth_bp.post("/login")
def login():
    try:
        data = login_schema.load(request.get_json())

        result = auth_service.login(data)

        return ResponseHelper.success(
            message="Login successful.",
            data=result,
            status_code=200
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
            status_code=401
        )


@auth_bp.post("/forgot-password")
def forgot_password():
    try:
        data = forgot_password_schema.load(request.get_json())

        auth_service.forgot_password(data["email"])

        # Same response whether or not the email exists - see
        # AuthService.forgot_password for why.
        return ResponseHelper.success(
            message=(
                "If an account with this email exists, "
                "a reset link has been sent."
            )
        )

    except ValidationError as error:
        return ResponseHelper.error(
            message="Validation error.",
            errors=error.messages,
            status_code=400
        )


@auth_bp.post("/reset-password")
def reset_password():
    try:
        data = reset_password_schema.load(request.get_json())

        auth_service.reset_password(data["token"], data["password"])

        return ResponseHelper.success(
            message="Password reset successfully."
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