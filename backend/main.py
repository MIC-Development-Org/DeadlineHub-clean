import os
import json
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from google import genai
from google.genai import types

import models, database

# Load environment variables (API Key)
load_dotenv()

# Initialize Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="DeadlineHub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class TaskSchema(BaseModel):
    id: int
    title: str
    category: str = "Academic"
    priority: str = "Medium"
    due_date: Optional[str] = None
    estimated_hours: int = 1
    submission_link: Optional[str] = None
    is_completed: bool = False

    class Config:
        from_attributes = True

class PromptSchema(BaseModel):
    prompt: str

# --- DB Endpoints ---
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
# --- task completion ---
@app.put("/api/tasks/{task_id}")
def toggle_task_completion(task_id: int, db: Session = Depends(database.get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.is_completed = not task.is_completed
    db.commit()
    return task

# --- AI Endpoint ---
@app.post("/api/ai-parse")
def parse_task_with_ai(payload: PromptSchema):
    system_instruction = """
    You are a task management assistant. Extract the task details from the user's prompt.
    Return ONLY a JSON object with the following keys:
    - title (string)
    - category (string: strictly choose from "Academic", "Club", or "Personal")
    - priority (string: strictly choose from "High", "Medium", or "Low")
    - due_date (string: YYYY-MM-DD format, or null if not mentioned)
    - estimated_hours (integer: guess based on task complexity if not mentioned, default 1)
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-3.8-flash',
            contents=payload.prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"API Error or High Demand: {e}")
        # Fallback Mock Data so the frontend team is never blocked
        return {
            "title": f"Hardcoded Fallback: {payload.prompt[:20]}...",
            "category": "Academic",
            "priority": "High",
            "due_date": "2026-11-06",
            "estimated_hours": 2
        }