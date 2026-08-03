from datetime import date

from app.models.wedding_plan import WeddingPlan
from app.repositories.wedding_plan_repository import WeddingPlanRepository


class WeddingPlanService:

    def __init__(self):
        self.repository = WeddingPlanRepository()

    def create_plan(
        self,
        owner_profile_id: int,
        plan_name: str,
        event_date,
        budget,
        notes: str = None
    ) -> WeddingPlan:

        plan = WeddingPlan(
            owner_profile_id=owner_profile_id,
            plan_name=plan_name,
            event_date=event_date,
            budget=budget,
            notes=notes
        )

        return self.repository.add(plan)

    def get_all(self) -> list[WeddingPlan]:
        return self.repository.get_all()

    def get_by_id(self, plan_id: int) -> WeddingPlan | None:
        return self.repository.get_by_id(plan_id)

    def get_by_owner(
        self,
        owner_profile_id: int
    ) -> list[WeddingPlan]:

        return self.repository.get_by_owner(owner_profile_id)

    def get_by_member(
        self,
        profile_id: int
    ) -> list[WeddingPlan]:

        return self.repository.get_by_member(profile_id)

    def update_plan(
        self,
        plan_id: int,
        data: dict,
        profile_id: int
    ) -> WeddingPlan:

        plan = self.get_by_id(plan_id)

        if plan is None:
            raise ValueError("Wedding plan not found.")

        if profile_id not in {plan.owner_profile_id, plan.partner_profile_id}:
            raise ValueError("Only wedding plan members can update this plan.")

        allowed_fields = {
            "plan_name",
            "event_date",
            "budget",
            "status",
            "notes"
        }

        for key, value in data.items():
            if key in allowed_fields:
                setattr(plan, key, value)

        self.repository.update()

        return plan

    def set_partner(
        self,
        plan_id: int,
        partner_profile_id: int
    ) -> WeddingPlan:

        plan = self.get_by_id(plan_id)

        if plan is None:
            raise ValueError("Wedding plan not found.")

        if plan.partner_profile_id is not None:
            raise ValueError("This wedding plan already has a partner.")

        if plan.owner_profile_id == partner_profile_id:
            raise ValueError("The owner cannot join as the partner.")

        plan.partner_profile_id = partner_profile_id

        self.repository.update()

        return plan

    def leave_plan(self, plan_id: int, profile_id: int) -> WeddingPlan:
        """
        The partner steps out and the plan carries on as the owner's own.
        Their pending choices go with them; anything already approved or
        booked was a joint decision, so it stays.
        """

        plan = self.get_by_id(plan_id)

        if plan is None:
            raise ValueError("Wedding plan not found.")

        if plan.partner_profile_id != profile_id:
            raise ValueError("Only the partner can leave this wedding plan.")

        for selection in plan.plan_services:
            if (
                selection.added_by_profile_id == profile_id
                and selection.status == "PENDING"
            ):
                selection.status = "REJECTED"

        plan.partner_profile_id = None

        self.repository.update()

        return plan

    def _has_live_booking(self, plan: WeddingPlan) -> bool:
        """
        A booked service the couple is still counting on. Once the wedding
        day has passed there is nothing left to protect.
        """

        if plan.event_date < date.today():
            return False

        return any(
            selection.status == "BOOKED"
            for selection in plan.plan_services
        )

    def delete_plan(self, plan_id: int, profile_id: int) -> bool:

        plan = self.get_by_id(plan_id)

        if plan is None:
            raise ValueError("Wedding plan not found.")

        if plan.owner_profile_id != profile_id:
            raise ValueError("Only the plan owner can delete this wedding plan.")

        # Deleting would drop the record of what was agreed on while the
        # provider is still holding the date - the bookings themselves live
        # on regardless, so this only ever hides them from the couple.
        if self._has_live_booking(plan):
            raise ValueError(
                "This plan has confirmed bookings. It can be deleted after "
                "the wedding date has passed."
            )

        self.repository.delete(plan)

        return True