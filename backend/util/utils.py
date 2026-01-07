import time
import random
import os
from functools import wraps
from flask import session, jsonify
def islogin():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not session.get("logged_in"):
                return jsonify({"error": "Login required"}), 401
            return func(*args, **kwargs)
        return wrapper
    return decorator

def isloginRole():
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not session.get("logged_in"):
                return jsonify({"error": "Login required"}), 401
            if session.get("role") != "admin":
                return jsonify({"error": "Access denied"}), 403
            return func(*args, **kwargs)
        return wrapper
    return decorator