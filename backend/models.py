from sqlalchemy import Column, Integer, String, Float, DateTime, Index
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()


class Destination(Base):
    __tablename__ = 'destinations'

    _id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    location = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    rating = Column(Float, default=0.0, index=True)
    budget = Column(String(50), nullable=False, index=True)
    season = Column(String(100), nullable=False, index=True)
    description = Column(String(2000))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Composite index for common queries
    __table_args__ = (
        Index('idx_category_budget_season', 'category', 'budget', 'season'),
        Index('idx_rating_category', 'rating', 'category'),
    )

    def to_dict(self):
        return {
            "_id": self._id,
            "name": self.name,
            "location": self.location,
            "category": self.category,
            "rating": float(self.rating) if self.rating else 0.0,
            "budget": self.budget,
            "season": self.season,
            "description": self.description,
        }

