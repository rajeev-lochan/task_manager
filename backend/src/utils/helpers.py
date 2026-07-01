import jwt
from sqlalchemy import text
from src.utils.db import get_db
from sqlalchemy.orm import Session
from src.utils.settings import settings
from fastapi import HTTPException, Request, Depends
from jwt import ExpiredSignatureError, InvalidTokenError

def is_authenticated(request: Request, db: Session = Depends(get_db)):
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