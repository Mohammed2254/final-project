from flask import Flask

from app.config import Config
from app.extensions import (
    db,
    migrate,
    jwt,
    bcrypt
)


def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    # Initialize Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.service_routes import service_bp
    from app.routes.booking_routes import booking_bp
    from app.routes.payment_routes import payment_bp
    from app.routes.favorite_routes import favorite_bp
    from app.routes.provider_routes import provider_bp
    from app.routes.

    app.register_blueprint(auth_bp)
    app.register_blueprint(service_bp)
    app.register_blueprint(booking_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(favorite_bp)
    app.register_blueprint(provider_bp)
    app.register_blueprint(wedding_plan_bp)

    return app