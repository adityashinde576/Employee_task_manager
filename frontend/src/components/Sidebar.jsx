import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { FiHome, FiUsers, FiCheckSquare, FiX } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";

export default function Sidebar({ role, isOpen, onClose }) {
  const location = useLocation();
  const { isDark } = useContext(ThemeContext);

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: FiHome },
    { path: "/admin/users", label: "Users", icon: FiUsers },
    { path: "/admin/tasks", label: "Tasks", icon: FiCheckSquare },
  ];

  const employeeLinks = [
    { path: "/employee/dashboard", label: "Dashboard", icon: FiHome },
    { path: "/employee/my-tasks", label: "My Tasks", icon: FiCheckSquare },
  ];

  const links = role === "admin" ? adminLinks : employeeLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30 top-16"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-16 h-[calc(100vh-4rem)] w-64 transition-transform duration-300 z-40 ${
          isDark ? "bg-gray-800 border-r border-gray-700" : "bg-white border-r border-gray-200"
        } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Menu
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <FiX size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {links.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(path)
                    ? isDark
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-600"
                    : isDark
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
