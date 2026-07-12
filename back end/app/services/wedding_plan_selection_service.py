from app.models.wedding_plan_service import WeddingPlanService as WeddingPlanServiceModel
from app.repositories.wedding_plan_service_repository import (
    WeddingPlanServiceRepository
)
from app.services.wedding_plan_service import WeddingPlanService


class WeddingPlanSelectionService:

    def __init__(self):
        self.repository = WeddingPlanServiceRepository()
        self.plan_service = WeddingPlanService()

    def add_service_to_plan(
        self,
        plan_id: int,
        service_id: int,
        added_by_profile_id: int,
        estimated_price,
        notes: str = None
    ) -> WeddingPlanServiceModel:

        plan = self.plan_service.get_by_id(plan_id)

        if plan is None:
            raise ValueError("Wedding plan not found.")

        if added_by_profile_id not in {
            plan.owner_profile_id,
            plan.partner_profile_id
        }:
            raise ValueError(
                "Only wedding plan members can add services."
            )

        plan_service = WeddingPlanServiceModel(
            plan_id=plan_id,
            service_id=service_id,
            added_by_profile_id=added_by_profile_id,
            estimated_price=estimated_price,
            notes=notes
        )

        return self.repository.add(plan_service)

    def get_by_id(
        self,
        plan_service_id: int
    ) -> WeddingPlanServiceModel | None:

        return self.repository.get_by_id(plan_service_id)

    def get_by_plan_id(
        self,
        plan_id: int
    ) -> list[WeddingPlanServiceModel]:

        return self.repository.get_by_plan_id(plan_id)

    def get_by_service_id(
        self,
        service_id: int
    ) -> list[WeddingPlanServiceModel]:

        return self.repository.get_by_service_id(service_id)

    def update_plan_service(
        self,
        plan_service_id: int,
        data: dict,
        profile_id: int
    ) -> WeddingPlanServiceModel:

        plan_service = self.get_by_id(plan_service_id)

        if plan_service is None:
            raise ValueError("Wedding plan service not found.")

        plan = self.plan_service.get_by_id(plan_service.plan_id)

        if profile_id not in {
            plan.owner_profile_id,
            plan.partner_profile_id
        }:
            raise ValueError(
                "Only wedding plan members can update services."
            )

        allowed_fields = {
            "estimated_price",
            "notes"
        }

        for key, value in data.items():
            if key in allowed_fields:
                setattr(plan_service, key, value)

        self.repository.update()

        return plan_service

    def remove_service_from_plan(
        self,
        plan_service_id: int,
        profile_id: int
    ) -> bool:

        plan_service = self.get_by_id(plan_service_id)

        if plan_service is None:
            raise ValueError("Wedding plan service not found.")

        plan = self.plan_service.get_by_id(plan_service.plan_id)

        if profile_id not in {
            plan.owner_profile_id,
            plan.partner_profile_id
        }:
            raise ValueError(
                "Only wedding plan members can remove services."
            )

        self.repository.delete(plan_service)

        return True