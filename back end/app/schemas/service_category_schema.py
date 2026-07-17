from marshmallow import Schema, fields


class ServiceCategoryResponseSchema(Schema):
    category_id = fields.Int(dump_only=True)
    category_name = fields.Str()
    description = fields.Str(allow_none=True)
