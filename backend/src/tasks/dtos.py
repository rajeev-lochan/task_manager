from pydantic import BaseModel

class TaskSchema(BaseModel):
    title : str
    description : str
    is_completed : bool = False

class TaskBase(BaseModel):
    id: int
    title: str
    description: str
    is_completed: bool

class TaskResponseSchema(BaseModel):
    message: str
    data: TaskBase