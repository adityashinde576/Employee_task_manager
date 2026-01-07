from flask import Blueprint, request, jsonify, session
from config import db
from models.task_model import Task
from models.user_model import User
from util import utils

task_routes = Blueprint("task_routes", __name__)

# ------------------- ADD TASK (ADMIN) -------------------
@task_routes.route("/api/add_task", methods=["POST"])
@utils.isloginRole()
def add_task():
    data = request.get_json()

    title = data.get("title")
    description = data.get("description")
    priority = data.get("priority", "Medium")
    assigned_to = data.get("assigned_to")

    if not title or not assigned_to:
        return jsonify({"error": "Title and assigned_to are required"}), 400

    user = User.query.get(assigned_to)
    if not user:
        return jsonify({"error": "Assigned user not found"}), 404

    task = Task(
        title=title,
        description=description,
        priority=priority,
        assigned_to=assigned_to
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task created successfully"}), 201


# ------------------- GET ALL TASKS (ADMIN) -------------------
@task_routes.route("/api/get_all_tasks", methods=["GET"])
@utils.isloginRole()
def get_all_tasks():
    tasks = Task.query.all()

    result = []
    for t in tasks:
        result.append({
            "task_id": t.task_id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "priority": t.priority,
            "assigned_to": t.assigned_to,
            "created_at": t.created_at.isoformat()
        })

    return jsonify({"tasks": result}), 200


# ------------------- MY TASKS (EMPLOYEE) -------------------
@task_routes.route("/api/my_tasks", methods=["GET"])
@utils.islogin()
def my_tasks():
    user_id = session.get("user_id")

    tasks = Task.query.filter_by(assigned_to=user_id).all()

    result = []
    for t in tasks:
        result.append({
            "task_id": t.task_id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "priority": t.priority,
            "created_at": t.created_at.isoformat()
        })

    return jsonify({"tasks": result}), 200


# ------------------- UPDATE TASK STATUS (EMPLOYEE) -------------------
@task_routes.route("/api/update_task_status/<int:task_id>", methods=["PUT"])
@utils.islogin()
def update_task_status(task_id):
    data = request.get_json()
    new_status = data.get("status")

    if new_status not in ["Pending", "In Progress", "Completed"]:
        return jsonify({"error": "Invalid status"}), 400

    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    if task.assigned_to != session.get("user_id"):
        return jsonify({"error": "Unauthorized"}), 403

    task.status = new_status
    db.session.commit()

    return jsonify({"message": "Task status updated"}), 200


# ------------------- DELETE TASK (ADMIN) -------------------
@task_routes.route("/api/delete_task/<int:task_id>", methods=["DELETE"])
@utils.isloginRole()
def delete_task(task_id):
    print(f"Delete task called for task_id: {task_id}")
    print(f"Session data: {dict(session)}")
    
    task = Task.query.get(task_id)

    if not task:
        print("Task not found")
        return jsonify({"error": "Task not found"}), 404

    print(f"Deleting task: {task.title}")
    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully"}), 200