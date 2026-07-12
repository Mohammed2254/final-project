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

    def update_plan(
        self,
        plan_id: int,
        data: dict
    ) -> WeddingPlan:

        plan = self.get_by_id(plan_id)

        if plan is None:
            raise ValueError("Wedding plan not found.")

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

    def delete_plan(self, plan_id: int) -> bool:

        plan = self.get_by_id(plan_id)

        if plan is None:
            raise ValueError("Wedding plan not found.")

        self.repository.delete(plan)

        return True