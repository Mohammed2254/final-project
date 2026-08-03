import requests
from flask import current_app

MOYASAR_BASE_URL = "https://api.moyasar.com/v1"


class MoyasarHelper:

    @staticmethod
    def fetch_payment(gateway_payment_id: str) -> dict:
        secret_key = current_app.config["MOYASAR_SECRET_KEY"]

        if not secret_key:
            raise ValueError(
                "Payment gateway is not configured on the server."
            )

        try:
            response = requests.get(
                f"{MOYASAR_BASE_URL}/payments/{gateway_payment_id}",
                auth=(secret_key, ""),
                timeout=15
            )
            response.raise_for_status()

            return response.json()

        # Anything the gateway does wrong - unknown payment id, bad key,
        # timeout - is a failed confirmation, not a crash. Raising ValueError
        # lets the route turn it into a 400 the customer can read, instead of
        # a 500 that leaks a stack trace.
        except requests.exceptions.HTTPError as error:
            if error.response is not None and error.response.status_code == 404:
                raise ValueError("Payment not found at the gateway.")

            raise ValueError("Could not verify the payment with the gateway.")

        except requests.exceptions.RequestException:
            raise ValueError("Could not reach the payment gateway.")
