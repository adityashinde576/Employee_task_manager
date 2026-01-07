import { useState, useEffect } from "react";
import api from "../api/axios";

export default function TaskForm({ onSubmit }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assigned_to: "",
  });

  useEffect(() => {
    api.get("/api/get_users").then((res) => setUsers(res.data.users));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        name="title"
        placeholder="Title"
        className="w-full border p-2"
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        className="w-full border p-2"
        onChange={handleChange}
      />

      <select
        name="assigned_to"
        className="w-full border p-2"
        onChange={handleChange}
        required
      >
        <option value="">Assign User</option>
        {users.map((u) => (
          <option key={u.user_id} value={u.user_id}>
            {u.username}
          </option>
        ))}
      </select>

      <select
        name="priority"
        className="w-full border p-2"
        onChange={handleChange}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
        Add Task
      </button>
    </form>
  );
}
