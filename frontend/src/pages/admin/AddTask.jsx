import api from "../../api/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddTask() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/api/get_users").then(res => setUsers(res.data.users));
  }, []);

const submit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const data = {
    title: formData.get("title"),
    assigned_to: Number(formData.get("assigned_to")), // 🔥 FIX
  };

  if (!data.title || !data.assigned_to) {
    toast.error("Title and user required");
    return;
  }

  try {
    await api.post("/api/add_task", data);
    toast.success("Task added");
    e.target.reset();
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed");
  }
};


  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow">
      <input name="title" placeholder="Task title" className="input" />
      <select name="assigned_to" className="input mt-2">
        {users.map(u => (
          <option key={u.username} value={u.user_id}>
            {u.username}
          </option>
        ))}
      </select>
      <button className="btn-primary mt-4">Add Task</button>
    </form>
  );
}
