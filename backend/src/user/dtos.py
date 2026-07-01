from pydantic import BaseModel
from datetime import datetime

class UserSchema(BaseModel):
    name : str
    username : str
    hash_password : str
    email : str


class LoginSchema(BaseModel):
    username : str
    password : str

class UserDataSchema(BaseModel):
    name: str
    username: str
    email: str

class LoginResponseSchema(BaseModel):
    token: str
    expires_at: datetime
    message: str
    data: UserDataSchema

class Token(BaseModel):
    access_token: str
    token_type: str