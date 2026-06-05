from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from backend.config import DATABASE_URL
from backend.models import Base

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)


def get_db() -> Session:
    """Get database session for dependency injection."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
