from marshmallow import Schema, fields

class AccountCreateSchema(Schema):
    email = fields.Email(
        required=True
    )

    password = fields.String(
        required=True,
        load_only=True
    )

    role = fields.String(
        required=True
    )


class AccountUpdateSchema(Schema):
    email = fields.Email(
        required=False
    )

    password = fields.String(
        required=False,
        load_only=True
    )

    role = fields.String(
        required=False
    )


class AccountResponseSchema(Schema):
    account_id = fields.Integer(
        dump_only=True
    )

    email = fields.Email()

    role = fields.String()

    created_at = fields.DateTime() 