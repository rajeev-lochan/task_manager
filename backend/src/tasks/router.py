from fastapi import APIRouter, Depends, status
from src.tasks import controller
from src.tasks.dtos import TaskSchema, TaskResponseSchema
from src.utils.db import get_db
from sqlalchemy.orm import Session
from src.utils.helpers import is_authenticated
from src.user.models import UserModel

task_routes = APIRouter(prefix="/api/v1/tasks")

@task_routes.post('/create', response_model=TaskResponseSchema, status_code=status.HTTP_201_CREATED)
def create_task(body: TaskSchema, db:Session = Depends(get_db), current_user:UserModel = Depends(is_authenticated)):
    return controller.create_task(body, current_user["id"], db)

# @task_routes.post(
#     "/create",
#     response_model=TaskResponseSchema,
#     status_code=201
# )
# def create_task(body: TaskSchema, db=Depends(get_db)):
#     return controller.create_task(body, db)

@task_routes.get('/all_tasks', status_code=status.HTTP_200_OK)
def get_tasks(db:Session = Depends(get_db), current_user:UserModel = Depends(is_authenticated)):
    return controller.get_tasks(current_user["id"], db)

@task_routes.get("/{task_id}", status_code=status.HTTP_200_OK)
def get_one_task(task_id: int, db:Session = Depends(get_db), current_user:UserModel = Depends(is_authenticated)):
    return controller.get_one_task(task_id, current_user["id"], db)

# @task_routes.put("/{task_id}", status_code=status.HTTP_201_CREATED)
# def update_task(
#     task_id: int,
#     body: TaskSchema,
#     db:Session = Depends(get_db),
#     current_user:UserModel = Depends(is_authenticated)
# ):
#     return controller.update_task(task_id, current_user["id"], body, db)

@task_routes.put("/{task_id}", status_code=status.HTTP_201_CREATED)
def update_task(
    task_id: int,
    body: TaskSchema,
    current_user=Depends(is_authenticated),
    db: Session = Depends(get_db)
):
    return controller.update_task(
        task_id,
        body,
        current_user["id"],
        db
    )

@task_routes.delete("/{task_id}")
def delete_task(task_id: int, db:Session = Depends(get_db), current_user:UserModel = Depends(is_authenticated)):
    return controller.delete_task(task_id, current_user["id"], db)