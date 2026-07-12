import secrets
from datetime import datetime

from app.models.wedding_plan_invitation import WeddingPlanInvitation
from app.repositories.wedding_plan_invitation_repository import (
    WeddingPlanInvitationRepository
)
from app.services.wedding_plan_service import WeddingPlanService


class WeddingPlanInvitationService:

    def __init__(self):
        self.repository = WeddingPlanInvitationRepository()
        self.plan_service = WeddingPlanService()

    def _generate_invite_code(self) -> str:
        while True:
            invite_code = secrets.token_urlsafe(12)

            if self.repository.get_by_code(invite_code) is None:
                return invite_code

    def create_invitation(
        self,
        plan_id: int,
        invited_email: str
    ) -> WeddingPlanInvitation:

        plan = self.plan_service.get_by_id(plan_id)

        if plan is None:
            raise ValueError("Wedding plan not found.")

        if plan.partner_profile_id is not None:
            raise ValueError("This wedding plan already has a partner.")

        invitation = WeddingPlanInvitation(
            plan_id=plan_id,
            invited_email=invited_email,
            invite_code=self._generate_invite_code()
        )

        return self.repository.add(invitation)

    def get_by_id(
        self,
        invitation_id: int
    ) -> WeddingPlanInvitation | None:

        return self.repository.get_by_id(invitation_id)

    def get_by_code(
        self,
        invite_code: str
    ) -> WeddingPlanInvitation | None:

        return self.repository.get_by_code(invite_code)

    def get_by_plan_id(
        self,
        plan_id: int
    ) -> list[WeddingPlanInvitation]:

        return self.repository.get_by_plan_id(plan_id)

    def accept_invitation(
        self,
        invite_code: str,
        accepted_by_profile_id: int
    ) -> WeddingPlanInvitation:

        invitation = self.get_by_code(invite_code)

        if invitation is None:
            raise ValueError("Invitation not found.")

        if invitation.status != "PENDING":
            raise ValueError("Invitation is no longer pending.")

        if invitation.expires_at < datetime.utcnow():
            invitation.status = "EXPIRED"
            self.repository.update()

            raise ValueError("Invitation has expired.")

        self.plan_service.set_partner(
            plan_id=invitation.plan_id,
            partner_profile_id=accepted_by_profile_id
        )

        invitation.accepted_by_profile_id = accepted_by_profile_id
        invitation.status = "ACCEPTED"

        self.repository.update()

        return invitation

    def reject_invitation(
        self,
        invite_code: str
    ) -> WeddingPlanInvitation:

        invitation = self.get_by_code(invite_code)

        if invitation is None:
            raise ValueError("Invitation not found.")

        if invitation.status != "PENDING":
            raise ValueError("Invitation is no longer pending.")

        invitation.status = "REJECTED"

        self.repository.update()

        return invitation

    def delete_invitation(
        self,
        invitation_id: int
    ) -> bool:

        invitation = self.get_by_id(invitation_id)

        if invitation is None:
            raise ValueError("Invitation not found.")

        self.repository.delete(invitation)

        return True