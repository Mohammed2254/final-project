"""Integration tests for the auth flow, exercised over real HTTP requests.

These go through the full stack: route -> schema -> service -> repository
-> database, and assert on the JSON envelope the API returns.
"""


def test_register_then_login_flow(client):
    # 1) Register a new customer.
    register_response = client.post("/api/auth/register/customer", json={
        "full_name": "Lina Saad",
        "email": "lina@example.com",
        "password": "password123",
    })

    assert register_response.status_code == 201
    body = register_response.get_json()
    assert body["success"] is True
    assert body["data"]["account"]["email"] == "lina@example.com"
    assert "access_token" in body["data"]

    # 2) Log in with the same credentials.
    login_response = client.post("/api/auth/login", json={
        "email": "lina@example.com",
        "password": "password123",
    })

    assert login_response.status_code == 200
    login_body = login_response.get_json()
    assert login_body["success"] is True
    assert "access_token" in login_body["data"]


def test_register_rejects_invalid_email(client):
    response = client.post("/api/auth/register/customer", json={
        "full_name": "Bad Email",
        "email": "not-an-email",
        "password": "password123",
    })

    assert response.status_code == 400
    body = response.get_json()
    assert body["success"] is False
    assert "email" in body["errors"]


def test_login_with_wrong_password_returns_401(client):
    client.post("/api/auth/register/customer", json={
        "full_name": "Lina Saad",
        "email": "lina@example.com",
        "password": "password123",
    })

    response = client.post("/api/auth/login", json={
        "email": "lina@example.com",
        "password": "wrongpassword",
    })

    assert response.status_code == 401
    assert response.get_json()["success"] is False


def test_create_service_requires_authentication(client):
    # No token -> the protected write endpoint must reject the request.
    response = client.post("/api/services/", json={
        "category_id": 1,
        "service_name": "Sneaky Service",
        "price": "100.00",
    })

    assert response.status_code == 401
