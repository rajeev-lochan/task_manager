from pydantic import BaseModel

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
    message: str
    data: UserDataSchema

class Token(BaseModel):
    access_token: str
    token_type: str