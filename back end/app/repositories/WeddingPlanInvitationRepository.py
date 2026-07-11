from app.extensions import db
from app.models.wedding_plan_invitation import WeddingPlanInvitation


class WeddingPlanInvitationRepository:

    def add(self, invitation: WeddingPlanInvitation) -> WeddingPlanInvitation:
        db.session.add(invitation)
        db.session.commit()
        return invitation

    def get_by_id(self, invitation_id: int) -> WeddingPlanInvitation | None:
        return WeddingPlanInvitation.query.get(invitation_id)

    def get_by_code(self, invite_code: str) -> WeddingPlanInvitation | None:
        return WeddingPlanInvitation.query.filter_by(
            invite_code=invite_code
        ).first()

    def get_by_plan_id(self, plan_id: int) -> list[WeddingPlanInvitation]:
        return WeddingPlanInvitation.query.filter_by(
            plan_id=plan_id
        ).all()

    def update(self) -> None:
        db.session.commit()

    def delete(self, invitation: WeddingPlanInvitation) -> None:
        db.session.delete(invitation)
        db.session.commit()