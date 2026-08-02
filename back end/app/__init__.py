import os
from flask import Flask, send_from_directory
from sqlalchemy import inspect, text

from app.config import DevelopmentConfig, ProductionConfig, TestingConfig
from app.extensions import db, migrate, jwt, bcrypt,cors
from app.routes.hall_details_routes import hall_bp
from app.utils.response_helper import ResponseHelper

# path to the built React app (frontend/dist)
FRONTEND_DIST = os.path.join(
    os.path.dirname(__file__), "..", "..", "frontend", "dist"
)


# Columns added to a table that already shipped. create_all() creates missing
# tables but never alters existing ones, so without this an older database
# keeps serving until the first query touches the new column and 500s.
_ADDED_COLUMNS = [
    ("bookings", "rejection_reason", "TEXT"),
]


def _add_missing_columns():
    inspector = inspect(db.engine)
    existing_tables = set(inspector.get_table_names())

    for table, column, column_type in _ADDED_COLUMNS:
        if table not in existing_tables:
            continue

        columns = {info["name"] for info in inspector.get_columns(table)}
        if column in columns:
            continue

        db.session.execute(
            text(f"ALTER TABLE {table} ADD COLUMN {column} {column_type}")
        )
        db.session.commit()


def _seed_service_categories():
    # a fresh database has no categories, and creating a service needs one
    from app.models.service_category import ServiceCategory

    if ServiceCategory.query.count() > 0:
        return

    db.session.add_all([
        ServiceCategory(
            category_name="قاعات الأفراح",
            description="خدمات قاعات وصالات الأفراح",
        ),
        ServiceCategory(
            category_name="التصوير",
            description="خدمات تصوير حفلات الزفاف",
        ),
    ])
    db.session.commit()

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
    from app.routes.favorite_routes import favorite_bp
    from app.routes.service_media_routes import service_media_bp
    from app.routes.wedding_plan_routes import (wedding_plan_bp)
    from app.routes.wedding_plan_invitation_routes import (wedding_plan_invitation_bp)
    from app.routes.wedding_plan_selection_routes import (wedding_plan_selection_bp)
    from app.routes.payment_routes import payment_bp

    with app.app_context():
        db.create_all()
        _add_missing_columns()
        _seed_service_categories()

    app.register_blueprint(account_bp, url_prefix="/api/accounts")
    app.register_blueprint(auth_bp,url_prefix="/api/auth")
    app.register_blueprint(service_bp,url_prefix="/api/services")
    app.register_blueprint(service_category_bp,url_prefix="/api/service-categories")
    app.register_blueprint(hall_bp,url_prefix="/api/halls")
    app.register_blueprint(photographer_bp,url_prefix="/api/photographers")
    app.register_blueprint(booking_bp,url_prefix="/api/bookings")
    app.register_blueprint(favorite_bp,url_prefix="/api/favorites")
    app.register_blueprint(service_media_bp,url_prefix="/api/service-media")
    app.register_blueprint(wedding_plan_bp,url_prefix="/api/wedding-plans")
    app.register_blueprint(wedding_plan_invitation_bp,url_prefix="/api/wedding-plan-invitations")
    app.register_blueprint(wedding_plan_selection_bp,url_prefix="/api/wedding-plan-selections")
    app.register_blueprint(payment_bp,url_prefix="/api/payments")

    # serve the React app for any non-api path (React Router handles the rest)
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        file_path = os.path.join(FRONTEND_DIST, path)

        if path and os.path.exists(file_path):
            return send_from_directory(FRONTEND_DIST, path)

        return send_from_directory(FRONTEND_DIST, "index.html")

    return app
