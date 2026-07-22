from marshmallow import Schema, fields, validate


class ServiceMediaCreateSchema(Schema):
    service_id = fields.Int(required=True)
    media_url = fields.Str(required=True, validate=validate.Length(max=500))
    media_type = fields.Str(load_default="IMAGE")
    is_main = fields.Bool(load_default=False)


class ServiceMediaUpdateSchema(Schema):
    media_url = fields.Str(required=False, validate=validate.Length(max=500))
    media_type = fields.Str(required=False)
    is_main = fields.Bool(required=False)


class ServiceMediaResponseSchema(Schema):
    media_id = fields.Int()
    service_id = fields.Int()
    media_url = fields.Str()
    media_type = fields.Str()
    is_main = fields.Bool()
    created_at = fields.DateTime()