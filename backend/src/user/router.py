from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.orm import Session
from src.user.dtos import UserSchema, LoginSchema, LoginResponseSchema
from src.utils.db import get_db
from src.user import controller

user_routes = APIRouter(prefix="/api/v1/user")

@user_routes.post("/register")
def register(body: UserSchema, db:Session = Depends(get_db)):
    return controller.register(body, db)

@user_routes.post("/login", response_model=LoginResponseSchema, status_code=status.HTTP_200_OK)
def login(body: LoginSchema, db:Session = Depends(get_db)):
    return controller.login_user(body, db)

@user_routes.get("/is_auth")
def is_auth(request: Request, db:Session = Depends(get_db)):
    return controller.is_authenticated(request, db)