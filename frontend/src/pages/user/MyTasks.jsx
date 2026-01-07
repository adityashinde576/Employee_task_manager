import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("/api/my_tasks").then(res => setTasks(res.data.tasks));
  }, []);

  const updateStatus = (id, status) => {
    api.put(`/api/update_task_status/${id}`, { status });
  };

  return (
    <div className="p-6">
      {tasks.map(t => (
        <div key={t.task_id} className="bg-white p-4 shadow rounded mb-2">
          <h3 className="font-bold">{t.title}</h3>
          <select
            value={t.status}
            onChange={(e) => updateStatus(t.task_id, e.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      ))}
    </div>
  );
}
