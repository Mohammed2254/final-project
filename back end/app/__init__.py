import os
from flask import Flask

from app.config import DevelopmentConfig, ProductionConfig, TestingConfig
from app.extensions import db, migrate, jwt, bcrypt,cors
from app.routes.hall_details_routes import hall_bp
from app.utils.response_helper import ResponseHelper

def create_app():
    app = Flask(__name__)

    env = os.getenv("FLASK_ENV", "development")

    if env == "production":
        app.config.from_object(ProductionConfig)
    elif env == "testing":
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            ]
        }
    }
)

    @jwt.unauthorized_loader
    def handle_missing_token(reason):
        return ResponseHelper.error(
            message="Authentication required.",
            status_code=401
        )

    @jwt.invalid_token_loader
    def handle_invalid_token(reason):
        return ResponseHelper.error(
            message="Invalid authentication token.",
            status_code=401
        )

    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        return ResponseHelper.error(
            message="Session expired, please log in again.",
            status_code=401
        )

    from app.routes.account_routes import account_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.service_routes import service_bp
    from app.routes.service_category_routes import service_category_bp
    from app.routes.photographer_details_routes import photographer_bp
    from app.routes.booking_routes import booking_bp
    from app.routes.service_media_routes import service_media_bp
    from app.routes.wedding_plan_routes import (wedding_plan_bp)
    from app.routes.wedding_plan_invitation_routes import (wedding_plan_invitation_bp)
    from app.routes.wedding_plan_selection_routes import (wedding_plan_selection_bp)

    with app.app_context():
        db.create_all()

    app.register_blueprint(account_bp, url_prefix="/api/accounts")
    app.register_blueprint(auth_bp,url_prefix="/api/auth")
    app.register_blueprint(service_bp,url_prefix="/api/services")
    app.register_blueprint(service_category_bp,url_prefix="/api/service-categories")
    app.register_blueprint(hall_bp,url_prefix="/api/halls")
    app.register_blueprint(photographer_bp,url_prefix="/api/photographers")
    app.register_blueprint(booking_bp,url_prefix="/api/bookings")
    app.register_blueprint(service_media_bp,url_prefix="/api/service-media")
    app.register_blueprint(wedding_plan_bp,url_prefix="/api/wedding-plans")
    app.register_blueprint(wedding_plan_invitation_bp,url_prefix="/api/wedding-plan-invitations")
    app.register_blueprint(wedding_plan_selection_bp,url_prefix="/api/wedding-plan-selections")

    return app
