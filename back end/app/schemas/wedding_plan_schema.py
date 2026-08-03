from datetime import date

from marshmallow import Schema, fields, validate, validates, ValidationError


class WeddingPlanCreateSchema(Schema):
    plan_name = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=150)
    )
    event_date = fields.Date(required=True)
    budget = fields.Decimal(
        required=True,
        as_string=True,
        validate=validate.Range(min=1, max=10_000_000)
    )
    notes = fields.Str(required=False, allow_none=True)

    # The browser form blocks a past date too, but that check is only there
    # to be helpful - this one is the one that actually holds.
    @validates("event_date")
    def event_date_is_not_in_the_past(self, value, **kwargs):
        if value < date.today():
            raise ValidationError("Event date cannot be in the past.")


class WeddingPlanUpdateSchema(Schema):
    plan_name = fields.Str(
        required=False,
        validate=validate.Length(min=2, max=150)
    )
    event_date = fields.Date(required=False)
    budget = fields.Decimal(
        required=False,
        as_string=True,
        validate=validate.Range(min=1, max=10_000_000)
    )
    status = fields.Str(required=False)
    notes = fields.Str(required=False, allow_none=True)


class WeddingPlanResponseSchema(Schema):
    plan_id = fields.Int()
    owner_profile_id = fields.Int()
    partner_profile_id = fields.Int(allow_none=True)
    plan_name = fields.Str()
    event_date = fields.Date()
    budget = fields.Decimal(as_string=True)
    status = fields.Str()
    notes = fields.Str(allow_none=True)
    created_at = fields.DateTime()
