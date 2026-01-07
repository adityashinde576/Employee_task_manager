import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import TaskForm from "../../components/TaskForm";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/get_all_tasks");
      setTasks(res.data.tasks);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ✅ ADD TASK */
  const addTask = async (data) => {
    try {
      await api.post("/api/add_task", data);
      toast.success("Task added");
      setShowAdd(false);
      fetchTasks();
    } catch (e) {
      toast.error(e.response?.data?.error || "Add task failed");
    }
  };

  /* ✅ DELETE TASK */
  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;

    try {
      await api.delete(`/api/delete_task/${id}`);
      setTasks((prev) => prev.filter((t) => t.task_id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Tasks</h1>

        {/* ✅ ADD BUTTON */}
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Task
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Assigned To</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((t) => (
            <tr key={t.task_id}>
              <td className="border p-2">{t.title}</td>
              <td className="border p-2">{t.assigned_to}</td>
              <td className="border p-2">{t.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => deleteTask(t.task_id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ ADD TASK MODAL */}
      <Modal
        isOpen={showAdd}
        title="Add Task"
        onClose={() => setShowAdd(false)}
      >
        <TaskForm onSubmit={addTask} />
      </Modal>
    </div>
  );
}
