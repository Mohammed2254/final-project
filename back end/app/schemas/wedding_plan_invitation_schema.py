from marshmallow import Schema, fields


class WeddingPlanInvitationCreateSchema(Schema):
    plan_id = fields.Int(required=True)
    invited_email = fields.Email(required=True)


class WeddingPlanInvitationAcceptSchema(Schema):
    invite_code = fields.Str(required=True)
    accepted_by_profile_id = fields.Int(required=True)


class WeddingPlanInvitationRejectSchema(Schema):
    invite_code = fields.Str(required=True)


class WeddingPlanInvitationResponseSchema(Schema):
    invitation_id = fields.Int()
    plan_id = fields.Int()
    invited_email = fields.Email()
    invite_code = fields.Str()
    status = fields.Str()
    accepted_by_profile_id = fields.Int(allow_none=True)
    expires_at = fields.DateTime()
    created_at = fields.DateTime()