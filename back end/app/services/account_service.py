from app.models.account import Account
from app.models.enums import AccountRole
from app.repositories.account_repository import AccountRepository
from app.utils.password_helper import PasswordHelper


class AccountService:
    def __init__(self):
        self.account_repository = AccountRepository()

    def create_account(self, email: str, password: str, role: AccountRole) -> Account:
        if self.email_exists(email):
            raise ValueError("Email already exists.")

        password_hash = PasswordHelper.hash_password(password)

        account = Account(
            email=email,
            password_hash=password_hash,
            role=role
        )

        return self.account_repository.add(account)

    def get_by_id(self, account_id: int) -> Account | None:
        return self.account_repository.get_by_id(account_id)

    def get_by_email(self, email: str) -> Account | None:
        return self.account_repository.get_by_email(email)

    def email_exists(self, email: str) -> bool:
        return self.account_repository.get_by_email(email) is not None

    def verify_password(self, email: str, password: str) -> bool:
        account = self.get_by_email(email)

        if account is None:
            return False

        return PasswordHelper.verify_password(
            password,
            account.password_hash
        )

    def change_password(self, account_id: int, new_password: str) -> Account:
        account = self.get_by_id(account_id)

        if account is None:
            raise ValueError("Account not found.")

        account.password_hash = PasswordHelper.hash_password(new_password)

        self.account_repository.update()

        return account

    def has_role(self, account: Account, role: AccountRole) -> bool:
        return account.role == role