from sqlalchemy import text
from sqlalchemy.orm import Session
from src.tasks.dtos import TaskSchema
from fastapi import HTTPException


def create_task(body: TaskSchema, user_id: int,db: Session):
    data = body.model_dump()

    result = db.execute(
        text("""
            SELECT fn_create_task(
                :title,
                :description,
                :completed,
                :user_id
            ) AS result;
        """),
        {
            "title": data["title"],
            "description": data["description"],
            "completed": data["is_completed"],
            "user_id": user_id
        }
    )

    db.commit()

    # return result.scalar()
    response = result.scalar()

    if not response:
        raise HTTPException(status_code=500, detail="No response from DB")

    status_code = response.get("status_code", 200)

    if status_code >= 400:
        raise HTTPException(
            status_code=status_code,
            detail=response.get("message", "Error")
        )

    return response
    # return response["data"]

def get_tasks(user_id: int, db: Session):
    result = db.execute(
        text("""
            SELECT fn_get_all_tasks(
                :user_id
            ) AS result;
        """),
        {
            "user_id": user_id
        }
    )

    # return result.scalar()
    response = result.scalar()

    if not response:
        raise HTTPException(status_code=500, detail="No response from DB")

    status_code = response.get("status_code", 200)

    if status_code >= 400:
        raise HTTPException(
            status_code=status_code,
            detail=response.get("message", "Error")
        )

    return response

def get_one_task(task_id: int, user_id: int, db: Session):
    result = db.execute(
        text("""
            SELECT fn_get_one_task(
                :task_id,
                :user_id
            ) AS result;
        """),
        {
            "task_id": task_id,
            "user_id": user_id
        }
    )

    # return result.scalar()
    response = result.scalar()

    if not response:
        raise HTTPException(status_code=500, detail="No response from DB")

    status_code = response.get("status_code", 200)

    if status_code >= 400:
        raise HTTPException(
            status_code=status_code,
            detail=response.get("message", "Error")
        )

    return response

def update_task(task_id: int, body: TaskSchema, user_id: int, db: Session):
    data = body.model_dump()

    result = db.execute(
        text("""
            SELECT fn_update_task(
                :task_id,
                :title,
                :description,
                :completed,
                :user_id
            ) AS result;
        """),
        {
            "task_id": task_id,
            "title": data["title"],
            "description": data["description"],
            "completed": data["is_completed"],
            "user_id": user_id
        }
    )

    db.commit()

    response = result.scalar()

    if not response:
        raise HTTPException(
            status_code=500,
            detail="No response from DB"
        )

    status_code = response.get("status_code", 200)

    if status_code >= 400:
        raise HTTPException(
            status_code=status_code,
            detail=response.get("message", "Error")
        )

    return response

def delete_task(task_id: int, user_id: int, db: Session):
    result = db.execute(
        text("""
            SELECT fn_delete_task(:task_id, :user_id) AS result;
        """),
        {
            "task_id": task_id,
            "user_id": user_id
        }
    )

    db.commit()

    return result.scalar()