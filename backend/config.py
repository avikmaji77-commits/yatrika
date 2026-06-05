import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data.db")
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"
FLASK_ENV = os.getenv("FLASK_ENV", "development")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FILE = os.getenv("LOG_FILE", "logs/app.log")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://localhost:8080").split(",")
API_MAX_RESULTS = int(os.getenv("API_MAX_RESULTS", "50"))
API_DEFAULT_PAGE_SIZE = int(os.getenv("API_DEFAULT_PAGE_SIZE", "20"))
