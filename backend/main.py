import os
import json
from datetime import datetime, timezone
from sqlalchemy import func
from fastapi import FastAPI, Depends, HTTPException, Query
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
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

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


class StudySessionCreate(BaseModel):
    user_id: str
    session_type: str
    duration_seconds: int
    started_at: datetime
    completed_at: datetime

    class Config:
        from_attributes = True


class StudySessionSchema(StudySessionCreate):
    id: int

@app.post("/api/study-sessions", response_model=StudySessionSchema)
def create_study_session(
    session: StudySessionCreate,
    db: Session = Depends(database.get_db)
):
    if session.duration_seconds <= 0:
        raise HTTPException(status_code=400, detail="Duration must be positive")

    started_at = session.started_at
    completed_at = session.completed_at

    # Store timestamps consistently in UTC
    if started_at.tzinfo:
        started_at = started_at.astimezone(timezone.utc).replace(tzinfo=None)

    if completed_at.tzinfo:
        completed_at = completed_at.astimezone(timezone.utc).replace(tzinfo=None)

    db_session = models.StudySession(
        user_id=session.user_id,
        session_type=session.session_type,
        duration_seconds=session.duration_seconds,
        started_at=started_at,
        completed_at=completed_at
    )

    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    return db_session


@app.get("/api/study-sessions", response_model=List[StudySessionSchema])
def get_study_sessions(
    user_id: str,
    db: Session = Depends(database.get_db)
):
    return (
        db.query(models.StudySession)
        .filter(models.StudySession.user_id == user_id)
        .order_by(models.StudySession.completed_at.desc())
        .all()
    )




@app.get("/api/study-sessions/monthly")
def get_monthly_study_stats(
    user_id: str,
    year: int,
    month: int,
    db: Session = Depends(database.get_db)
):
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")
    
    if year < 2000 or year > 2100:
        raise HTTPException(status_code=400, detail="Invalid year")

    start_date = datetime(year, month, 1)

    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)

    daily_stats = (
        db.query(
            func.date(models.StudySession.completed_at).label("study_date"),
            func.sum(models.StudySession.duration_seconds).label("total_seconds"),
            func.count(models.StudySession.id).label("session_count")
        )
        .filter(
            models.StudySession.user_id == user_id,
            models.StudySession.completed_at >= start_date,
            models.StudySession.completed_at < end_date
        )
        .group_by(func.date(models.StudySession.completed_at))
        .order_by(func.date(models.StudySession.completed_at))
        .all()
    )

    days = [
        {
            "date": str(row.study_date),
            "total_seconds": row.total_seconds,
            "session_count": row.session_count
        }
        for row in daily_stats
    ]

    return {
        "year": year,
        "month": month,
        "total_seconds": sum(day["total_seconds"] for day in days),
        "days_studied": len(days),
        "daily_stats": days
    }
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
    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key is not configured"
        )
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