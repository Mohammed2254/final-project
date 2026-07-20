from app.extensions import db
from app.models.wedding_plan import WeddingPlan


class WeddingPlanRepository:

    def add(self, plan: WeddingPlan) -> WeddingPlan:
        db.session.add(plan)
        db.session.commit()
        return plan

    def get_by_id(self, plan_id: int) -> WeddingPlan | None:
        return WeddingPlan.query.get(plan_id)

    def get_all(self) -> list[WeddingPlan]:
        return WeddingPlan.query.all()

    def get_by_owner(self, owner_profile_id: int) -> list[WeddingPlan]:
        return WeddingPlan.query.filter_by(
            owner_profile_id=owner_profile_id
        ).all()

    def get_by_member(self, profile_id: int) -> list[WeddingPlan]:
        return WeddingPlan.query.filter(
            db.or_(
                WeddingPlan.owner_profile_id == profile_id,
                WeddingPlan.partner_profile_id == profile_id
            )
        ).all()

    def update(self) -> None:
        db.session.commit()

    def delete(self, plan: WeddingPlan) -> None:
        db.session.delete(plan)
        db.session.commit()