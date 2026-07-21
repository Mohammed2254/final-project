from marshmallow import Schema, fields


class WeddingPlanSelectionCreateSchema(Schema):
    plan_id = fields.Int(required=True)
    service_id = fields.Int(required=True)
    estimated_price = fields.Decimal(required=True, as_string=True)
    notes = fields.Str(required=False, allow_none=True)


class WeddingPlanSelectionUpdateSchema(Schema):
    estimated_price = fields.Decimal(required=False, as_string=True)
    notes = fields.Str(required=False, allow_none=True)


class WeddingPlanSelectionResponseSchema(Schema):
    plan_service_id = fields.Int()
    plan_id = fields.Int()
    service_id = fields.Int()
    added_by_profile_id = fields.Int()
    estimated_price = fields.Decimal(as_string=True)
    status = fields.Str()
    notes = fields.Str(allow_none=True)
    created_at = fields.DateTime()