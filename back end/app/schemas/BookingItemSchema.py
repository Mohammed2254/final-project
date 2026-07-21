from marshmallow import Schema, fields, validate


class BookingItemSchema(Schema):
    service_id = fields.Int(required=True)
    quantity = fields.Int(required=False, load_default=1)
    price_at_booking = fields.Decimal(required=True, as_string=True)
    notes = fields.Str(required=False, allow_none=True)


class BookingCreateSchema(Schema):
    event_date = fields.Date(required=True)
    notes = fields.Str(required=False, allow_none=True)
    items = fields.List(
        fields.Nested(BookingItemSchema),
        required=True
    )


class BookingUpdateSchema(Schema):
    event_date = fields.Date(required=False)
    notes = fields.Str(required=False, allow_none=True)


class BookingStatusUpdateSchema(Schema):
    status = fields.Str(
        required=True,
        validate=validate.OneOf(["CONFIRMED", "REJECTED"])
    )


class BookingItemResponseSchema(Schema):
        booking_item_id = fields.Int()
        service_id = fields.Int()
        service_name = fields.Method("get_service_name")
        quantity = fields.Int()
        price_at_booking = fields.Decimal(as_string=True)
        notes = fields.Str(allow_none=True)

        def get_service_name(self, booking_item):
            return (
                booking_item.service.service_name
                if booking_item.service else None
            )



class BookingResponseSchema(Schema):
    booking_id = fields.Int()
    customer_profile_id = fields.Int()
    customer_name = fields.Method("get_customer_name")
    customer_email = fields.Method("get_customer_email")
    event_date = fields.Date()
    status = fields.Str()
    notes = fields.Str()
    total_price = fields.Decimal(as_string=True)
    created_at = fields.DateTime()

    items = fields.List(
        fields.Nested(BookingItemResponseSchema),
        attribute="booking_items"
    )

    def get_customer_name(self, booking):
        return booking.customer.full_name if booking.customer else None

    def get_customer_email(self, booking):
        if booking.customer and booking.customer.account:
            return booking.customer.account.email
        return None
