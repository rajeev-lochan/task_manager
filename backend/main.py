from fastapi import FastAPI
from src.utils.db import Base, engine
from src.tasks.router import task_routes

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Task Manager",
    description="A simple task manager API built with FastAPI."
)

app.include_router(task_routes)