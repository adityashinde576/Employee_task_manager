from datetime import datetime
from config import db

class Task(db.Model):
    __tablename__ = "tasks"

    task_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20),default="Pending")

    priority = db.Column(
        db.String(20),
        default="Medium"   # Low | Medium | High
    )

    assigned_to = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id"),
        nullable=False
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
