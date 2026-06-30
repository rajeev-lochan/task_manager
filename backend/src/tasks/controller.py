from sqlalchemy import text
from sqlalchemy.orm import Session
from src.tasks.dtos import TaskSchema


def create_task(body: TaskSchema, db: Session):
    data = body.model_dump()

    result = db.execute(
        text("""
            SELECT fn_create_task(
                :title,
                :description,
                :completed
            ) AS result;
        """),
        {
            "title": data["title"],
            "description": data["description"],
            "completed": data["is_completed"]
        }
    )

    db.commit()

    return result.scalar()


def get_tasks(db: Session):
    result = db.execute(
        text("""
            SELECT fn_get_all_tasks() AS result;
        """)
    )

    return result.scalar()