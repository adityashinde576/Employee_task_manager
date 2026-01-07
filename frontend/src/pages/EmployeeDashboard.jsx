import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role === "admin" ? "admin" : "user";

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const res = await api.get("/api/my_tasks");
      setTasks(res.data.tasks || []);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (task_id, newStatus) => {
    try {
      await api.put(`/api/update_task_status/${task_id}`, { status: newStatus });
      toast.success("Task updated");
      fetchMyTasks();
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const priorityColor = {
    Low: "bg-green-100 text-green-800 border-green-300",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    High: "bg-red-100 text-red-800 border-red-300",
  };

  const statusColor = {
    Pending: "bg-gray-100 text-gray-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No tasks assigned yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div
              key={task.task_id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-600 mt-2">{task.description}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold border ${
                    priorityColor[task.priority] || priorityColor["Medium"]
                  }`}
                >
                  {task.priority} Priority
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div>
                    <label className="text-gray-600 text-sm">Status:</label>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(task.task_id, e.target.value)
                      }
                      className={`ml-2 px-3 py-1 rounded border border-gray-300 focus:outline-none ${
                        statusColor[task.status] || statusColor["Pending"]
                      }`}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>
                {task.created_at && (
                  <span className="text-gray-400 text-sm">
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
