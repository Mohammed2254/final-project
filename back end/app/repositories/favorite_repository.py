from app.models.favorite import Favorite
from app.repositories.base_repository import BaseRepository


class FavoriteRepository(BaseRepository):

    def __init__(self):
        super().__init__(Favorite)

    def get_by_user_id(self, user_profile_id: int) -> list[Favorite]:
        return Favorite.query.filter_by(
            user_profile_id=user_profile_id
        ).all()

    def get_by_user_and_service(
        self,
        user_profile_id: int,
        service_id: int
    ) -> Favorite | None:

        return Favorite.query.filter_by(
            user_profile_id=user_profile_id,
            service_id=service_id
        ).one_or_none()
