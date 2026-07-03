from datetime import datetime

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
)


class UserSchema(BaseModel):
    name: str
    username: str = Field(..., min_length=4, max_length=50)
    hash_password: str = Field(..., min_length=8, max_length=128)
    email: EmailStr

    @field_validator("name", "username", "hash_password")
    @classmethod
    def validate_not_empty(cls, value: str):
        if not value.strip():
            raise ValueError("Field cannot be empty.")
        return value


class LoginSchema(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)

    @field_validator("username", "password")
    @classmethod
    def validate_not_empty(cls, value: str):
        if not value.strip():
            raise ValueError("Field cannot be empty.")
        return value


class UserDataSchema(BaseModel):
    name: str
    username: str
    email: EmailStr


class LoginResponseSchema(BaseModel):
    token: str
    expires_at: datetime
    message: str
    data: UserDataSchema


class Token(BaseModel):
    access_token: str
    token_type: str