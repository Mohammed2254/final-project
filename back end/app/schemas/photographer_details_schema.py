from marshmallow import Schema, fields, validate

class PhotographerDetailsCreateSchema(Schema):
    service_id = fields.Int(required=True)
    camera_type = fields.Str(required=False, allow_none=True)
    coverage_hours = fields.Int(
        required=True,
        validate=validate.Range(min=1, max=48)
    )
    has_video = fields.Bool(required=False)
    has_drone = fields.Bool(required=False)
    portfolio_url = fields.Str(required=False, allow_none=True)


class PhotographerDetailsUpdateSchema(Schema):
    camera_type = fields.Str(required=False, allow_none=True)
    coverage_hours = fields.Int(
        required=False,
        validate=validate.Range(min=1, max=48)
    )
    has_video = fields.Bool(required=False)
    has_drone = fields.Bool(required=False)
    portfolio_url = fields.Str(required=False, allow_none=True)


class PhotographerDetailsResponseSchema(Schema):
    photographer_details_id = fields.Int()
    service_id = fields.Int()
    camera_type = fields.Str(allow_none=True)
    coverage_hours = fields.Int()
    has_video = fields.Bool()
    has_drone = fields.Bool()
    portfolio_url = fields.Str(allow_none=True)