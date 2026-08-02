import requests
from flask import current_app

MOYASAR_BASE_URL = "https://api.moyasar.com/v1"


class MoyasarHelper:

    @staticmethod
    def fetch_payment(gateway_payment_id: str) -> dict:
        secret_key = current_app.config["MOYASAR_SECRET_KEY"]

        response = requests.get(
            f"{MOYASAR_BASE_URL}/payments/{gateway_payment_id}",
            auth=(secret_key, ""),
            timeout=15
        )
        response.raise_for_status()

        return response.json()
