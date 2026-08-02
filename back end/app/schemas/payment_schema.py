from marshmallow import Schema, fields


class PaymentConfirmSchema(Schema):
    booking_id = fields.Integer(
        required=True
    )

    gateway_payment_id = fields.String(
        required=True
    )


class PaymentResponseSchema(Schema):
    payment_id = fields.Integer(
        dump_only=True
    )

    booking_id = fields.Integer()

    amount = fields.Decimal(
        as_string=True
    )

    currency = fields.String()

    status = fields.String()

    gateway_payment_id = fields.String()

    paid_at = fields.DateTime(
        allow_none=True
    )

    created_at = fields.DateTime()
