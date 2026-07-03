from datetime import datetime, timedelta, timezone
from src.user.dtos import UserSchema, LoginSchema
from sqlalchemy.orm import Session
from sqlalchemy import text
from pwdlib import PasswordHash
from fastapi import HTTPException, Request
import json
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
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
    
    response = result.scalar()
    # If PostgreSQL returns JSON as a string
    if isinstance(response, str):
        response = json.loads(response)

    if response["status_code"] != 200:
        raise HTTPException(
            status_code=response["status_code"],
            detail=response["message"]
        )

    return response

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

    # Verify password
    if not verify_password(
        data["password"],
        user["hash_password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )


    # expire_time = datetime.now(timezone.utc) + timedelta(minutes=settings.TOKEN_EXPIRE_MINUTES)
    expire_time = datetime.now(timezone.utc) + timedelta(minutes=settings.TOKEN_EXPIRE_MINUTES)
    # expire_time = datetime.now(timezone.utc) + timedelta(seconds=30)



    token = jwt.encode({
        "_id":user["id"],
        "username":user["username"],
        "exp": expire_time
    }, settings.SECRETE_KEY, settings.ALGORITHM)


    # Remove sensitive information
    # user.pop("hash_password", None)

    return {
        "token": token,
        "expires_at": expire_time.isoformat(),
        "message": "Login successful",
        "data": user
    }

# def is_authenticated(request: Request, db: Session):
#     token = request.headers["authorization"]
#     token = token.split(" ")[-1]

#     data = jwt.decode(token, settings.SECRETE_KEY, settings.ALGORITHM)
#     user_id = data["_id"]
#     expires_at = data["exp"]
#     current_time = datetime.now().timestamp()

#     if current_time > expires_at:
#         raise HTTPException(
#             status_code=401,
#             detail="You are not authorized to access this resource"
#         )


#     return "Done"

def is_authenticated(request: Request, db: Session):
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is missing"
        )

    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(
            token,
            settings.SECRETE_KEY,
            algorithms=[settings.ALGORITHM]
        )
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user_id = payload["_id"]

    result = db.execute(
        text("""
            SELECT fn_get_user_by_id(:user_id) AS result;
        """),
        {
            "user_id": user_id
        }
    )

    response = result.scalar()

    if response["status_code"] >= 400:
        raise HTTPException(
            status_code=response["status_code"],
            detail=response["message"]
        )

    return response["data"]