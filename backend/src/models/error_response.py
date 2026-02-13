"""RFC 7807 Problem Details error response models."""
from typing import Any, Optional
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """RFC 7807 Problem Details response."""

    type: str = "about:blank"
    title: str
    status: int
    detail: Optional[str] = None
    instance: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "type": "about:blank",
                "title": "Not Found",
                "status": 404,
                "detail": "The requested resource was not found.",
                "instance": "/api/v1/users/123"
            }
        }


class ValidationError(BaseModel):
    """Validation error detail."""

    loc: list[str]
    msg: str
    type: str


class ValidationErrorResponse(BaseModel):
    """Validation error response."""

    type: str = "about:blank"
    title: str = "Validation Error"
    status: int = 422
    detail: str = "Request validation failed"
    errors: list[ValidationError]
