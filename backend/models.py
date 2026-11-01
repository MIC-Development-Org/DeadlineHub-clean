from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, default="Academic")  # Academic, Club, Personal
    priority = Column(String, default="Medium")    # High, Medium, Low
    due_date = Column(String, nullable=True)        # YYYY-MM-DD
    estimated_hours = Column(Integer, default=1)
    submission_link = Column(String, nullable=True)
    is_completed = Column(Boolean, default=False)