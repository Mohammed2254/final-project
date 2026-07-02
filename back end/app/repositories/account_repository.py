from app.models.account import Account
from app.repositories.base_repository import BaseRepository


class AccountRepository(BaseRepository):

    def __init__(self):
        super().__init__(Account)

    def get_by_email(self, email):
        return Account.query.filter_by(
            email=email
        ).first()