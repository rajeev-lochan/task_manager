from src.user.dtos import UserSchema, LoginSchema
from sqlalchemy.orm import Session
from sqlalchemy import text
from pwdlib import PasswordHash
from fastapi import HTTPException
import jwt
from src.utils.settings import settings

password_hash = PasswordHash.recommended()

def get_password_hash(password: str) -> str:
    return password_hash.hash(password)

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def register(body: UserSchema, db:Session):
    data = body.model_dump()
    hashed_password = get_password_hash(data["hash_password"])
    result = db.execute(
        text("""
            SELECT fn_create_user(
                :name,
                :username,
                :hash_password,
                :email
            ) AS result;
        """),
        {
            "name": data["name"],
            "username": data["username"],
            "hash_password": hashed_password,
            "email": data["email"]
        }
    )
    db.commit()
    return result.scalar()

def login_user(body:LoginSchema, db: Session):
    data = body.model_dump()
    result = db.execute(
        text("""
            SELECT fn_login_user(
                :username
            ) AS result;
        """),
        {
            "username": data["username"]
        }
    )

    response = result.scalar()
    if response["status_code"] >= 400:
        raise HTTPException(
            status_code=response["status_code"],
            detail=response["message"]
        )

    user = response["data"]
    print(user["id"], '========') 

    # Verify password
    if not verify_password(
        data["password"],
        user["hash_password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = jwt.encode({
        "_id":user["id"],
        "username":user["name"]
    }, settings.SECRETE_KEY, settings.ALGORITHM)


    # Remove sensitive information
    # user.pop("hash_password", None)

    return {
        "token": token,
        "message": "Login successful",
        "data": user
    }