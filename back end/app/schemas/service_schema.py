from marshmallow import Schema, fields, validate

class ServiceCreateSchema(Schema):
    # Optional and ignored on create - the owning provider is taken from
    # the JWT, not the request body. Kept here only for backward
    # compatibility with clients that still send it.
    provider_profile_id = fields.Integer(
        required=False
    )

    category_id = fields.Integer(
        required=True
    )

    service_name = fields.String(
        required=True,
        validate=validate.Length(min=2, max=150)
    )

    description = fields.String(
        required=False,
        allow_none=True,
        validate=validate.Length(max=1000)
    )

    price = fields.Decimal(
        required=True,
        as_string=True
    )


class ServiceUpdateSchema(Schema):
    category_id = fields.Integer(
        required=False
    )

    service_name = fields.String(
        required=False,
        validate=validate.Length(min=2, max=150)
    )

    description = fields.String(
        required=False,
        allow_none=True,
        validate=validate.Length(max=1000)
    )

    price = fields.Decimal(
        required=False,
        as_string=True
    )


class ServiceResponseSchema(Schema):
    service_id = fields.Integer(
        dump_only=True
    )

    provider_profile_id = fields.Integer()

    category_id = fields.Integer()

    service_name = fields.String()

    description = fields.String(
        allow_none=True
    )

    price = fields.Decimal(
        as_string=True
    )

    is_active = fields.Boolean()

    created_at = fields.DateTime()