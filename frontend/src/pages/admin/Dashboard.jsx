import { useEffect, useMemo, useState, useContext } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { FiUsers, FiCheckSquare, FiDownload } from "react-icons/fi";
import Modal from "../../components/Modal";
import UserForm from "../../components/UserForm";
import TaskForm from "../../components/TaskForm";
import { StatCard, RoleBadge, EmptyState } from "../../components/UIComponents";
import { UserStatsChart, TaskStatsChart, ActivityTrendChart } from "../../components/charts/Charts";
import { exportToCSV } from "../../utils/helpers";
import { ThemeContext } from "../../context/ThemeContext";

const ITEMS_PER_PAGE = 10;

export default function Dashboard({ initialTab = "dashboard" }) {
  const { isDark } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ---------------- USERS STATE ---------------- */
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userSortConfig, setUserSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  /* ---------------- TASKS STATE ---------------- */
  const [taskSearch, setTaskSearch] = useState("");
  const [taskPage, setTaskPage] = useState(1);
  const [taskSortConfig, setTaskSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  /* ---------------- STATS ---------------- */
  const stats = useMemo(
    () => ({
      total_users: users.length,
      admin_users: users.filter(u => u.role === "admin").length,
      total_tasks: tasks.length,
      completed_tasks: tasks.filter(t => t.status === "Completed").length,
    }),
    [users, tasks]
  );

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/get_users");
      setUsers(res.data?.users || []);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/get_all_tasks");
      setTasks(res.data?.tasks || []);
    } catch {
      toast.error("Failed to fetch tasks");
    }
  };

  /* ---------------- HELPERS ---------------- */
  const userMap = useMemo(() => {
    return users.reduce((acc, u) => {
      acc[u.user_id] = u.username;
      return acc;
    }, {});
  }, [users]);

  const mappedTasks = useMemo(() => {
    return tasks.map((t) => ({
      ...t,
      assigned_to_name: userMap[t.assigned_to] || t.assigned_to,
    }));
  }, [tasks, userMap]);

  /* ---------------- USERS FILTER + SORT ---------------- */
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) =>
        [u.fullname, u.username, u.email]
          .filter(Boolean)
          .some((v) =>
            v.toLowerCase().includes(userSearch.toLowerCase())
          )
      )
      .sort((a, b) => {
        if (!userSortConfig.key) return 0;
        const x = a[userSortConfig.key];
        const y = b[userSortConfig.key];
        if (x < y) return userSortConfig.direction === "asc" ? -1 : 1;
        if (x > y) return userSortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [users, userSearch, userSortConfig]);

  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, userPage]);

  /* ---------------- TASKS FILTER + SORT ---------------- */
  const filteredTasks = useMemo(() => {
    return mappedTasks
      .filter((t) =>
        [t.title, t.assigned_to_name]
          .filter(Boolean)
          .some((v) =>
            v.toLowerCase().includes(taskSearch.toLowerCase())
          )
      )
      .sort((a, b) => {
        if (!taskSortConfig.key) return 0;
        const x = a[taskSortConfig.key];
        const y = b[taskSortConfig.key];
        if (x < y) return taskSortConfig.direction === "asc" ? -1 : 1;
        if (x > y) return taskSortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [mappedTasks, taskSearch, taskSortConfig]);

  const paginatedTasks = useMemo(() => {
    const start = (taskPage - 1) * ITEMS_PER_PAGE;
    return filteredTasks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTasks, taskPage]);

  /* ---------------- ACTIONS ---------------- */
  const handleAddUser = async (formData) => {
    setLoading(true);
    try {
      console.log("Sending user data:", formData);
      const response = await api.post("/api/add_user", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("User creation response:", response);
      toast.success("User added successfully");
      setShowUserModal(false);
      fetchUsers();
    } catch (e) {
      console.error("User creation error:", e);
      console.error("Error response:", e.response);
      console.error("Error data:", e.response?.data);
      const errorMessage = e.response?.data?.error || e.message || "Add user failed";
      console.error("Final error message:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
  try {
    await api.post("/api/add_task", {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      assigned_to: taskData.assigned_to,
    });

    toast.success("Task created successfully");
    setShowTaskModal(false);
    fetchTasks();
  } catch (err) {
    toast.error(err.response?.data?.error || "Task creation failed");
  }
};


  const confirmDeletion = async () => {
    console.log("confirmDeletion called with:", confirmDelete);
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === "user") {
        console.log("Deleting user:", confirmDelete.id);
        await api.delete(`/api/delete_user/${confirmDelete.id}`);
        fetchUsers();
      } else {
        console.log("Deleting task:", confirmDelete.id);
        await api.delete(`/api/delete_task/${confirmDelete.id}`);
        fetchTasks();
      }
      toast.success("Deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.error || "Delete failed");
    }
    setConfirmDelete(null);
  };

  /* ---------------- TABLE CONFIG ---------------- */
  const userColumns = [
    "user_id",
    "fullname",
    "username",
    "email",
    "phone",
    "gender",
    "role",
    "created_at",
  ];

  const userData = paginatedUsers.map((u) => ({
    ...u,
    created_at: u.created_at
      ? new Date(u.created_at).toLocaleDateString()
      : "-",
  }));

  const taskColumns = ["title", "assigned_to", "priority", "status"];

  const taskData = paginatedTasks.map((t) => ({
    ...t,
    assigned_to: t.assigned_to_name,
  }));

  useEffect(() => setUserPage(1), [userSearch]);
  useEffect(() => setTaskPage(1), [taskSearch]);

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="p-6 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Dashboard
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-300 dark:border-gray-700">
          {["dashboard", "users", "tasks"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : isDark
                  ? "border-transparent text-gray-400 hover:text-gray-300"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FiUsers}
                title="Total Users"
                value={stats.total_users}
                color="blue"
              />
              <StatCard
                icon={FiUsers}
                title="Admin Users"
                value={stats.admin_users}
                color="red"
              />
              <StatCard
                icon={FiCheckSquare}
                title="Total Tasks"
                value={stats.total_tasks}
                color="purple"
              />
              <StatCard
                icon={FiCheckSquare}
                title="Completed Tasks"
                value={stats.completed_tasks}
                color="green"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-lg ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  User Statistics
                </h3>
                <UserStatsChart data={users} />
              </div>
              <div className={`p-6 rounded-lg ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Task Distribution
                </h3>
                <TaskStatsChart data={tasks} />
              </div>
            </div>

            {/* Activity Trend */}
            <div className={`p-6 rounded-lg ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Activity Trend
              </h3>
              <ActivityTrendChart data={tasks} />
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <input
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Search users by name, email, or username..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <button
                onClick={() => setShowUserModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                + Add User
              </button>
              <button
                onClick={() => {
                  const exportData = paginatedUsers.map(u => ({
                    ID: u.user_id,
                    Name: u.fullname,
                    Username: u.username,
                    Email: u.email,
                    Phone: u.phone,
                    Role: u.role,
                    Gender: u.gender,
                  }));
                  exportToCSV(exportData, "users.csv");
                  toast.success("Users exported successfully");
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <FiDownload size={16} /> Export
              </button>
            </div>

            {paginatedUsers.length > 0 ? (
              <div className={`rounded-lg border overflow-x-auto ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <table className="w-full">
                  <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      {userColumns.map((col) => (
                        <th
                          key={col}
                          onClick={() =>
                            setUserSortConfig((s) => ({
                              key: col,
                              direction: s.key === col && s.direction === "asc" ? "desc" : "asc",
                            }))
                          }
                          className={`px-6 py-3 text-left text-sm font-semibold cursor-pointer hover:${isDark ? "bg-gray-600" : "bg-gray-100"} ${isDark ? "text-gray-200" : "text-gray-700"}`}
                        >
                          {col.replace(/_/g, " ").toUpperCase()} {userSortConfig.key === col && (userSortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                      ))}
                      <th className={`px-6 py-3 text-left text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                    {userData.map((user, idx) => (
                      <tr key={idx} className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                        {userColumns.map((col) => (
                          <td
                            key={col}
                            className={`px-6 py-4 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                          >
                            {col === "role" ? <RoleBadge role={user[col]} /> : user[col]}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => {
                              console.log("Delete button clicked for user:", user.user_id);
                              setConfirmDelete({ type: "user", id: user.user_id });
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState message="No users found" icon={FiUsers} />
            )}

            {/* Pagination */}
            {filteredUsers.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setUserPage(p => Math.max(1, p - 1))}
                  disabled={userPage === 1}
                  className={`px-3 py-2 rounded ${userPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Previous
                </button>
                <span className={`px-3 py-2 ${isDark ? "text-gray-300" : ""}`}>
                  Page {userPage} of {Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)}
                </span>
                <button
                  onClick={() => setUserPage(p => Math.min(Math.ceil(filteredUsers.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={userPage >= Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)}
                  className={`px-3 py-2 rounded ${userPage >= Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <input
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Search tasks by title or assignee..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
              />
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                + Add Task
              </button>
              <button
                onClick={() => {
                  const exportData = paginatedTasks.map(t => ({
                    ID: t.task_id,
                    Title: t.title,
                    Description: t.description,
                    Priority: t.priority,
                    Status: t.status,
                    AssignedTo: t.assigned_to_name,
                  }));
                  exportToCSV(exportData, "tasks.csv");
                  toast.success("Tasks exported successfully");
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <FiDownload size={16} /> Export
              </button>
            </div>

            {paginatedTasks.length > 0 ? (
              <div className={`rounded-lg border overflow-x-auto ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <table className="w-full">
                  <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      {taskColumns.map((col) => (
                        <th
                          key={col}
                          onClick={() =>
                            setTaskSortConfig((s) => ({
                              key: col,
                              direction: s.key === col && s.direction === "asc" ? "desc" : "asc",
                            }))
                          }
                          className={`px-6 py-3 text-left text-sm font-semibold cursor-pointer hover:${isDark ? "bg-gray-600" : "bg-gray-100"} ${isDark ? "text-gray-200" : "text-gray-700"}`}
                        >
                          {col.replace(/_/g, " ").toUpperCase()} {taskSortConfig.key === col && (taskSortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                      ))}
                      <th className={`px-6 py-3 text-left text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                    {taskData.map((task, idx) => (
                      <tr key={idx} className={isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                        {taskColumns.map((col) => (
                          <td
                            key={col}
                            className={`px-6 py-4 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                          >
                            {col === "status" ? (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                task[col] === "Completed" ? "bg-green-200 text-green-800" :
                                task[col] === "In Progress" ? "bg-yellow-200 text-yellow-800" :
                                "bg-gray-200 text-gray-800"
                              }`}>
                                {task[col]}
                              </span>
                            ) : (
                              task[col]
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => {
                              console.log("Delete button clicked for task:", task.task_id);
                              setConfirmDelete({ type: "task", id: task.task_id });
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState message="No tasks found" icon={FiCheckSquare} />
            )}

            {/* Pagination */}
            {filteredTasks.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setTaskPage(p => Math.max(1, p - 1))}
                  disabled={taskPage === 1}
                  className={`px-3 py-2 rounded ${taskPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Previous
                </button>
                <span className={`px-3 py-2 ${isDark ? "text-gray-300" : ""}`}>
                  Page {taskPage} of {Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)}
                </span>
                <button
                  onClick={() => setTaskPage(p => Math.min(Math.ceil(filteredTasks.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={taskPage >= Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)}
                  className={`px-3 py-2 rounded ${taskPage >= Math.ceil(filteredTasks.length / ITEMS_PER_PAGE) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showUserModal}
        title="Add New User"
        onClose={() => setShowUserModal(false)}
      >
        <UserForm onSubmit={handleAddUser} isLoading={loading} />
      </Modal>

      <Modal
        isOpen={showTaskModal}
        title="Create New Task"
        onClose={() => setShowTaskModal(false)}
      >
        <TaskForm users={users} onSubmit={handleAddTask} isLoading={loading} />
      </Modal>

      <Modal
        isOpen={!!confirmDelete}
        title="Confirm Deletion"
        onClose={() => setConfirmDelete(null)}
      >
        <div className={`p-4 space-y-4`}>
          <p className={isDark ? "text-gray-300" : "text-gray-700"}>
            Are you sure you want to delete this {confirmDelete?.type}? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={confirmDeletion}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(null)}
              className={`flex-1 px-4 py-2 rounded transition ${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
