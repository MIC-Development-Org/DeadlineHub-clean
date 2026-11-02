
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, default="Academic")
    priority = Column(String, default="Medium")
    due_date = Column(String, nullable=True)
    estimated_hours = Column(Integer, default=1)
    submission_link = Column(String, nullable=True)
    is_completed = Column(Boolean, default=False)


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(String, nullable=False, index=True)

    session_type = Column(String, nullable=False)
    duration_seconds = Column(Integer, nullable=False)

    started_at = Column(DateTime, nullable=False)
    completed_at = Column(DateTime, nullable=False)
