from config import create_app, db
from flask_cors import CORS
from flask_session import Session
from routes.user_route import user_routes
from routes.task_routes import task_routes
from datetime import timedelta
app = create_app()

# 🔐 SECRET KEY
app.secret_key = "9529645157"

# ================= SESSION CONFIG =================
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=1)
app.config["SESSION_USE_SIGNER"] = True

# ✅ CORRECT FOR LOCALHOST
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False

Session(app)

CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:3000", "http://localhost:3001"]
)
# ================= BLUEPRINTS =================
app.register_blueprint(user_routes)
app.register_blueprint(task_routes)
# ================= UPLOAD CONFIG =================
app.config["UPLOAD_FOLDER"] = "uploads"
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024

# ================= DB INIT =================
with app.app_context():
    db.create_all()
    
    # Create demo users if they don't exist
    from models.user_model import User
    from config import bcrypt
    
    # Create demo admin user
    if not User.query.filter_by(username="admin").first():
        hashed_pw = bcrypt.generate_password_hash("admin123").decode("utf-8")
        admin_user = User(
            fullname="Administrator",
            username="admin",
            email="admin@example.com",
            password=hashed_pw,
            phone="1234567890",
            gender="male",
            role="admin"
        )
        db.session.add(admin_user)
    
    # Create demo regular user
    if not User.query.filter_by(username="user").first():
        hashed_pw = bcrypt.generate_password_hash("user123").decode("utf-8")
        demo_user = User(
            fullname="Demo User",
            username="user",
            email="user@example.com",
            password=hashed_pw,
            phone="0987654321",
            gender="female",
            role="user"
        )
        db.session.add(demo_user)
    
    db.session.commit()

# ================= TEST ROUTE =================
@app.route("/")
def home():
    return {"message": "Flask OLX API running"}

# ================= RUN =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
