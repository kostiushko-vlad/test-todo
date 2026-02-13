from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None


class TodoResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TodoListResponse(BaseModel):
    items: list[TodoResponse]
    total: int
    page: int
    page_size: int
