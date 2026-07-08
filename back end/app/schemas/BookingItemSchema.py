from marshmallow import Schema, fields


class BookingItemSchema(Schema):
    service_id = fields.Int(required=True)
    quantity = fields.Int(required=False, load_default=1)
    price_at_booking = fields.Decimal(required=True, as_string=True)
    notes = fields.Str(required=False, allow_none=True)


class BookingCreateSchema(Schema):
    customer_profile_id = fields.Int(required=True)
    event_date = fields.Date(required=True)
    notes = fields.Str(required=False, allow_none=True)
    items = fields.List(
        fields.Nested(BookingItemSchema),
        required=True
    )


class BookingUpdateSchema(Schema):
    event_date = fields.Date(required=False)
    status = fields.Str(required=False)
    notes = fields.Str(required=False, allow_none=True)
    total_price = fields.Decimal(
        required=False,
        as_string=True
    )


class BookingItemResponseSchema(Schema):
        booking_item_id = fields.Int()
        service_id = fields.Int()
        quantity = fields.Int()
        price_at_booking = fields.Decimal(as_string=True)
        notes = fields.Str(allow_none=True)



class BookingResponseSchema(Schema):
    booking_id = fields.Int()
    customer_profile_id = fields.Int()
    event_date = fields.Date()
    status = fields.Str()
    notes = fields.Str()
    total_price = fields.Decimal(as_string=True)
    created_at = fields.DateTime()

    items = fields.List(
        fields.Nested(BookingItemResponseSchema),
        attribute="booking_items"
    )
