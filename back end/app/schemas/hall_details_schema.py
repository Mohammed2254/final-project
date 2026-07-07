from marshmallow import Schema, fields, validate

class HallDetailsCreateSchema(Schema):
    service_id = fields.Integer(
        required=True
    )

    min_capacity = fields.Integer(
        required=True,
        validate=validate.Range(min=1)
    )

    max_capacity = fields.Integer(
        required=True,
        validate=validate.Range(min=1)
    )

    city = fields.String(
        required=True,
        validate=validate.Length(min=2, max=100)
    )

    address = fields.String(
        required=True,
        validate=validate.Length(min=2, max=255)
    )

    latitude = fields.Decimal(
        required=False,
        allow_none=True,
        as_string=True
    )

    longitude = fields.Decimal(
        required=False,
        allow_none=True,
        as_string=True
    )


class HallDetailsUpdateSchema(Schema):
    min_capacity = fields.Integer(
        required=False,
        validate=validate.Range(min=1)
    )

    max_capacity = fields.Integer(
        required=False,
        validate=validate.Range(min=1)
    )

    city = fields.String(
        required=False,
        validate=validate.Length(min=2, max=100)
    )

    address = fields.String(
        required=False,
        validate=validate.Length(min=2, max=255)
    )

    latitude = fields.Decimal(
        required=False,
        allow_none=True,
        as_string=True
    )

    longitude = fields.Decimal(
        required=False,
        allow_none=True,
        as_string=True
    )


class HallDetailsResponseSchema(Schema):
    hall_details_id = fields.Integer(
        dump_only=True
    )

    service_id = fields.Integer()

    min_capacity = fields.Integer()

    max_capacity = fields.Integer()

    city = fields.String()

    address = fields.String()

    latitude = fields.Decimal(
        as_string=True,
        allow_none=True
    )

    longitude = fields.Decimal(
        as_string=True,
        allow_none=True
    )
