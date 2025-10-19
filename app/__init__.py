import os
from flask import Flask
from .config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

app.config.from_object(Config)

if 'UPLOAD_FOLDER' not in app.config or app.config['UPLOAD_FOLDER'] is None:
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db = SQLAlchemy(app)

migrate = Migrate(app, db)
jwt = JWTManager(app)
csrf = CSRFProtect(app)

from app import views