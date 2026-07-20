from marshmallow import Schema, fields


class WeddingPlanCreateSchema(Schema):
    plan_name = fields.Str(required=True)
    event_date = fields.Date(required=True)
    budget = fields.Decimal(required=True, as_string=True)
    notes = fields.Str(required=False, allow_none=True)


class WeddingPlanUpdateSchema(Schema):
    plan_name = fields.Str(required=False)
    event_date = fields.Date(required=False)
    budget = fields.Decimal(required=False, as_string=True)
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