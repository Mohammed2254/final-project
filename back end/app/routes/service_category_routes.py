from flask import Blueprint

from app.schemas.service_category_schema import ServiceCategoryResponseSchema
from app.services.service_category_service import ServiceCategoryService
from app.utils.response_helper import ResponseHelper


service_category_bp = Blueprint(
    "service_categories",
    __name__
)

service_category_service = ServiceCategoryService()

response_schema = ServiceCategoryResponseSchema()
responses_schema = ServiceCategoryResponseSchema(many=True)


@service_category_bp.get("/")
def get_all_categories():
    categories = service_category_service.get_all()

    return ResponseHelper.success(
        data=responses_schema.dump(categories)
    )


@service_category_bp.get("/<int:category_id>")
def get_category(category_id):
    category = service_category_service.get_by_id(category_id)

    if category is None:
        return ResponseHelper.error(
            message="Category not found.",
            status_code=404
        )

    return ResponseHelper.success(
        data=response_schema.dump(category)
    )
