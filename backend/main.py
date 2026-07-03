from fastapi import FastAPI
from src.utils.db import Base, engine
from src.tasks.router import task_routes
from src.user.router import user_routes
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Task Manager",
    description="A simple task manager API built with FastAPI."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Must be False when using "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task_routes)
app.include_router(user_routes)