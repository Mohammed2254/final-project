from marshmallow import Schema, fields


class FavoriteCreateSchema(Schema):
    service_id = fields.Int(required=True)


class FavoriteResponseSchema(Schema):
    favorite_id = fields.Int(dump_only=True)
    user_profile_id = fields.Int()
    service_id = fields.Int()
    created_at = fields.DateTime()
