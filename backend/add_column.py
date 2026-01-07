from config import db, create_app
from sqlalchemy import text

app = create_app()

with app.app_context():
    # Add the role column if it doesn't exist
    try:
        db.session.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'"))
        db.session.commit()
        print("Role column added successfully")
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()