"""Unit tests for FavoriteService."""
from decimal import Decimal

import pytest

from app.extensions import db
from app.models.service_category import ServiceCategory
from app.services.auth_service import AuthService
from app.services.favorite_service import FavoriteService
from app.services.service_service import ServiceService


def _seed_customer_and_service(app):
    auth = AuthService()

    customer = auth.register_customer({
        "full_name": "Nora Ali",
        "email": "nora@example.com",
        "password": "password123",
    })

    provider = auth.register_provider({
        "business_name": "Golden Hall",
        "phone_number": "0555000111",
        "email": "hall@example.com",
        "password": "password123",
    })

    category = ServiceCategory(category_name="Halls")
    db.session.add(category)
    db.session.commit()

    service = ServiceService().create_service(
        provider_profile_id=provider["provider_profile"]["provider_profile_id"],
        category_id=category.category_id,
        service_name="Grand Ballroom",
        description=None,
        price=Decimal("5000.00"),
    )

    return customer["user_profile"]["user_profile_id"], service.service_id


def test_add_favorite_saves_the_service(app):
    user_id, service_id = _seed_customer_and_service(app)

    favorite = FavoriteService().add_favorite(user_id, service_id)

    assert favorite.user_profile_id == user_id
    assert favorite.service_id == service_id


def test_add_favorite_rejects_a_duplicate(app):
    user_id, service_id = _seed_customer_and_service(app)
    service = FavoriteService()
    service.add_favorite(user_id, service_id)

    with pytest.raises(ValueError, match="Service is already in favorites."):
        service.add_favorite(user_id, service_id)


def test_get_by_user_id_returns_only_that_users_favorites(app):
    user_id, service_id = _seed_customer_and_service(app)
    FavoriteService().add_favorite(user_id, service_id)

    favorites = FavoriteService().get_by_user_id(user_id)

    assert len(favorites) == 1
    assert favorites[0].service_id == service_id


def test_get_by_user_id_is_empty_for_a_user_with_no_favorites(app):
    user_id, _ = _seed_customer_and_service(app)

    assert FavoriteService().get_by_user_id(user_id) == []


def test_remove_favorite_deletes_it(app):
    user_id, service_id = _seed_customer_and_service(app)
    service = FavoriteService()
    service.add_favorite(user_id, service_id)

    service.remove_favorite(user_id, service_id)

    assert service.get_by_user_id(user_id) == []


def test_remove_favorite_rejects_one_that_does_not_exist(app):
    user_id, service_id = _seed_customer_and_service(app)

    with pytest.raises(ValueError, match="Favorite not found."):
        FavoriteService().remove_favorite(user_id, service_id)
