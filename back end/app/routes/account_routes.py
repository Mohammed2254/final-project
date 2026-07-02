from flask import Blueprint, request
from marshmallow import ValidationError

from app.schemas.account_schema import (
    AccountCreateSchema,
    AccountResponseSchema,
)

from app.services.account_service import AccountService
from app.utils.response_helper import ResponseHelper

account_bp = Blueprint("account", __name__)

account_service = AccountService()

account_create_schema = AccountCreateSchema()
account_response_schema = AccountResponseSchema()


@account_bp.post("/")
def create_account():
    try:
        data = account_create_schema.load(request.get_json())

        account = account_service.create_account(
            email=data["email"],
            password=data["password"],
            role=data["role"]
        )

        response_data = account_response_schema.dump(account)

        return ResponseHelper.success(
            message="Account created successfully.",
            data=response_data,
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


@account_bp.get("/<int:account_id>")
def get_account(account_id):
    account = account_service.get_by_id(account_id)

    if account is None:
        return ResponseHelper.error(
            message="Account not found.",
            status_code=404
        )

    response_data = account_response_schema.dump(account)

    return ResponseHelper.success(
        message="Account retrieved successfully.",
        data=response_data,
        status_code=200
    )


@account_bp.get("/email")
def get_account_by_email():
    email = request.args.get("email")

    if not email:
        return ResponseHelper.error(
            message="Email query parameter is required.",
            status_code=400
        )

    account = account_service.get_by_email(email)

    if account is None:
        return ResponseHelper.error(
            message="Account not found.",
            status_code=404
        )

    response_data = account_response_schema.dump(account)

    return ResponseHelper.success(
        message="Account retrieved successfully.",
        data=response_data,
        status_code=200
    )