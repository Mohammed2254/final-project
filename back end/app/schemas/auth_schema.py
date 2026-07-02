from marshmallow import Schema, fields, validate

class CustomerRegisterSchema(Schema):
    full_name = fields.String(
        required=True,
        validate=validate.Length(min=2, max=100)
    )

    email = fields.Email(
        required=True
    )

    password = fields.String(
        required=True,
        load_only=True,
        validate=validate.Length(min=8, max=128)
    )


class ProviderRegisterSchema(Schema):
    business_name = fields.String(
        required=True,
        validate=validate.Length(min=2, max=150)
    )

    description = fields.String(
        required=False,
        allow_none=True,
        validate=validate.Length(max=500)
    )

    phone_number = fields.String(
        required=True,
        validate=validate.Length(min=8, max=20)
    )

    logo_path = fields.String(
        required=False,
        allow_none=True
    )

    email = fields.Email(
        required=True
    )

    password = fields.String(
        required=True,
        load_only=True,
        validate=validate.Length(min=8, max=128)
    )


class LoginSchema(Schema):
    email = fields.Email(
        required=True
    )

    password = fields.String(
        required=True,
        load_only=True
    )


class AuthResponseSchema(Schema):
    access_token = fields.String(
        dump_only=True
    )

    role = fields.String(
        dump_only=True
    )

    account_id = fields.Integer(
        dump_only=True
    )