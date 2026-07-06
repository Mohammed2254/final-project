import os
from flask import Flask
from flask_cors import CORS

from app.config import DevelopmentConfig, ProductionConfig, TestingConfig
from app.extensions import db, migrate, jwt, bcrypt


def create_app():
    app = Flask(__name__)

    env = os.getenv("FLASK_ENV", "development")

    if env == "production":
        app.config.from_object(ProductionConfig)
    elif env == "testing":
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(DevelopmentConfig)
    
    CORS(
        app,
        resources={r"/api/*": {"origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ]}},
        supports_credentials=True,
    )
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    from app.routes.account_routes import account_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.service_routes import service_bp

    app.register_blueprint(account_bp, url_prefix="/api/accounts")
    app.register_blueprint(auth_bp,url_prefix="/api/auth")
    app.register_blueprint(service_bp,url_prefix="/api/services")

    return app