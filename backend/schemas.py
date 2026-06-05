from pydantic import BaseModel, Field, validator
from typing import Optional, List


class DestinationSchema(BaseModel):
    _id: int
    name: str
    location: str
    category: str
    rating: float
    budget: str
    season: str
    description: str

    class Config:
        from_attributes = True


class RecommendRequest(BaseModel):
    interests: List[str] = Field(default_factory=list)
    budget: Optional[str] = None
    season: Optional[str] = None

    @validator('interests')
    def validate_interests(cls, v):
        return [i.lower().strip() for i in v if i]


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)

    @validator('message')
    def validate_message(cls, v):
        return v.strip()


class FilterRequest(BaseModel):
    category: Optional[str] = None
    budget: Optional[str] = None
    season: Optional[str] = None
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    max_rating: Optional[float] = Field(None, ge=0, le=5)
    search: Optional[str] = Field(None, max_length=200)
    limit: Optional[int] = Field(50, ge=1, le=100)
    offset: Optional[int] = Field(0, ge=0)

    @validator('budget', 'season', 'category')
    def lowercase_filters(cls, v):
        return v.lower() if v else None


class ExportRequest(BaseModel):
    format: str = Field(default="json")
    fields: Optional[List[str]] = None
    category: Optional[str] = None
    budget: Optional[str] = None
    season: Optional[str] = None
    min_rating: Optional[float] = None

    @validator('format')
    def validate_format(cls, v):
        if v not in ['json', 'csv']:
            raise ValueError('format must be "json" or "csv"')
        return v
