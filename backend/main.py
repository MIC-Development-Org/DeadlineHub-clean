from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import models, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="DeadlineHub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskSchema(BaseModel):
    title: str
    category: str = "Academic"
    priority: str = "Medium"
    due_date: Optional[str] = None
    estimated_hours: int = 1
    submission_link: Optional[str] = None
    is_completed: bool = False

    class Config:
        from_attributes = True

@app.get("/api/tasks", response_model=List[TaskSchema])
def get_tasks(db: Session = Depends(database.get_db)):
    return db.query(models.Task).all()

@app.post("/api/tasks")
def create_task(task: TaskSchema, db: Session = Depends(database.get_db)):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task