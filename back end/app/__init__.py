import os
from flask import Flask

from app.config import DevelopmentConfig, ProductionConfig, TestingConfig
from app.extensions import db, migrate, jwt, bcrypt,cors
from app.routes.hall_details_routes import hall_bp

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
            "origins": "http://localhost:5173"
        }
    }
)

    from app.routes.account_routes import account_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.service_routes import service_bp
    from app.routes.photographer_details_routes import photographer_bp
    from app.routes.booking_routes import booking_bp

    with app.app_context():
        db.create_all()

    app.register_blueprint(account_bp, url_prefix="/api/accounts")
    app.register_blueprint(auth_bp,url_prefix="/api/auth")
    app.register_blueprint(service_bp,url_prefix="/api/services")
    app.register_blueprint(hall_bp,url_prefix="/api/halls")
    app.register_blueprint(photographer_bp,url_prefix="/api/photographers")
    app.register_blueprint(booking_bp,url_prefix="/api/bookings")

    return app