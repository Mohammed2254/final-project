"""
extensions.py

Shared Flask extensions used throughout the application.
"""

from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

# Password Hashing
bcrypt = Bcrypt()

# Database ORM
db = SQLAlchemy()

# Database Migration
migrate = Migrate()

# JWT Authentication
jwt = JWTManager()