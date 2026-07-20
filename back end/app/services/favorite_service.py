from app.models.favorite import Favorite
from app.repositories.favorite_repository import FavoriteRepository


class FavoriteService:

    def __init__(self):
        self.repository = FavoriteRepository()

    def add_favorite(
        self,
        user_profile_id: int,
        service_id: int
    ) -> Favorite:

        existing = self.repository.get_by_user_and_service(
            user_profile_id,
            service_id
        )

        if existing is not None:
            raise ValueError("Service is already in favorites.")

        favorite = Favorite(
            user_profile_id=user_profile_id,
            service_id=service_id
        )

        return self.repository.add(favorite)

    def get_by_user_id(self, user_profile_id: int) -> list[Favorite]:
        return self.repository.get_by_user_id(user_profile_id)

    def remove_favorite(
        self,
        user_profile_id: int,
        service_id: int
    ) -> bool:

        favorite = self.repository.get_by_user_and_service(
            user_profile_id,
            service_id
        )

        if favorite is None:
            raise ValueError("Favorite not found.")

        self.repository.delete(favorite)

        return True
