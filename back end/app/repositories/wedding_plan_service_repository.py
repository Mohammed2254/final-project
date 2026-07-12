from app.extensions import db
from app.models.wedding_plan_service import WeddingPlanService


class WeddingPlanServiceRepository:

    def add(self, plan_service: WeddingPlanService) -> WeddingPlanService:
        db.session.add(plan_service)
        db.session.commit()
        return plan_service

    def get_by_id(self, plan_service_id: int) -> WeddingPlanService | None:
        return WeddingPlanService.query.get(plan_service_id)

    def get_by_plan_id(self, plan_id: int) -> list[WeddingPlanService]:
        return WeddingPlanService.query.filter_by(
            plan_id=plan_id
        ).all()

    def get_by_service_id(self, service_id: int) -> list[WeddingPlanService]:
        return WeddingPlanService.query.filter_by(
            service_id=service_id
        ).all()

    def update(self) -> None:
        db.session.commit()

    def delete(self, plan_service: WeddingPlanService) -> None:
        db.session.delete(plan_service)
        db.session.commit()