from flask import Blueprint, request, jsonify, session
from config import db, bcrypt
from models.user_model import User
from flask_cors import CORS
from util import utils

user_routes = Blueprint("user_routes", __name__)
CORS(user_routes, supports_credentials=True)

# ------------------- ADD USER -------------------
# ------------------- ADD USER (JSON version) -------------------
@user_routes.route("/api/add_user", methods=["POST"])
def add_user():
    print("Add user called")
    print("Request content type:", request.content_type)
    print("Request data:", request.get_data())
    # Expecting JSON data
    data = request.get_json()  # <-- Get JSON from request body
    print("JSON data:", data)
    if not data:
        print("No JSON data")
        return jsonify({"error": "Invalid JSON"}), 400

    fullname = data.get("fullname", "").strip()
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    phone = data.get("phone", "").strip() if data.get("phone") else None
    gender = data.get("gender", "").strip()
    role = data.get("role", "user")

    print(f"Trimmed data: fullname='{fullname}', username='{username}', email='{email}', password='{password}', phone='{phone}', gender='{gender}', role='{role}'")

    # Required fields check
    if not all([fullname, username, email, password]):
        print("Missing required fields after trim")
        return jsonify({"error": "Missing required fields"}), 400

    # Duplicate check
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        print(f"Username {username} already exists")
        return jsonify({"error": "Username already exists"}), 400
    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        print(f"Email {email} already exists")
        return jsonify({"error": "Email already exists"}), 400

    # Hash password
    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

    # Create user
    new_user = User(
        fullname=fullname,
        username=username,
        email=email,
        password=hashed_pw,
        phone=phone,
        gender=gender,
        role=role
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        print("User created successfully")
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating user: {e}")
        return jsonify({"error": "Failed to create user"}), 500


@user_routes.route("/api/delete_all_users", methods=["DELETE"])
@utils.isloginRole()
def delete_all_users():
    try:
        users = User.query.all()

        if not users:
            return jsonify({"message": "No users found"}), 200

        for user in users:
            db.session.delete(user)

        db.session.commit()

        return jsonify({"message": "All users deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ------------------- GET USERS -------------------
@user_routes.route("/api/get_users", methods=["GET"])
def get_users():
    users = User.query.all()

    result = []
    for u in users:
        result.append({
            "user_id": u.user_id,
            "fullname": u.fullname,
            "username": u.username,
            "email": u.email,
            "phone": u.phone,
            "gender": u.gender,
            "role": u.role,
            "created_at": u.created_at.isoformat() if u.created_at else None
            # Removed password hash for security reasons
        })

    return jsonify({"users": result}), 200

# ------------------- LOGIN -------------------
@user_routes.route("/api/login", methods=["POST"])
def login():
    # Expecting JSON body
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid request, JSON body required"}), 400

    username_or_email = data.get("username_or_email")
    password = data.get("password")

    if not username_or_email or not password:
        return jsonify({"error": "Username/email and password are required"}), 400

    user = User.query.filter(
        (User.username == username_or_email) | (User.email == username_or_email)
    ).first()

    if not user:
        return jsonify({"error": "Invalid username/email"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect password"}), 401

    session["logged_in"] = True
    session["username"] = user.username
    session["user_id"] = user.user_id
    session["role"] = user.role
    
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.user_id,
            "fullname": user.fullname,
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "gender": user.gender,
            "role": user.role
        }
    }), 200

@user_routes.route("/api/delete_user/<int:user_id>", methods=["DELETE"])
@utils.isloginRole()
def delete_user(user_id):
    print(f"Delete user called for user_id: {user_id}")
    print(f"Session data: {dict(session)}")
    
    user = User.query.get(user_id)

    if not user:
        print("User not found")
        return jsonify({"error": "User not found"}), 404

    # Prevent deleting self only
    if user.user_id == session.get("user_id"):
        print("Cannot delete self")
        return jsonify({"error": "Cannot delete yourself"}), 403

    print(f"Deleting user: {user.username}")
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200

# ------------------- LOGOUT -------------------
@user_routes.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logout successful"}), 200