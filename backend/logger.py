import logging
import os
from backend.config import LOG_LEVEL, LOG_FILE

# Create logs directory if it doesn't exist
os.makedirs(os.path.dirname(LOG_FILE) if os.path.dirname(LOG_FILE) else ".", exist_ok=True)

# Configure logger
logger = logging.getLogger("yatrika-backend")
logger.setLevel(LOG_LEVEL)

# Console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(LOG_LEVEL)

# File handler
file_handler = logging.FileHandler(LOG_FILE)
file_handler.setLevel(LOG_LEVEL)

# Formatter
formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# Add handlers
logger.addHandler(console_handler)
logger.addHandler(file_handler)

__all__ = ["logger"]
