import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { FiMoon, FiSun, FiLogOut, FiMenu } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useContext(ThemeContext);
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));

  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className={`sticky top-0 z-40 transition-all ${
      isDark 
        ? "bg-gray-800 border-b border-gray-700" 
        : "bg-white border-b border-gray-200"
    } shadow-md`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onMenuClick}
            className={`lg:hidden p-2 rounded-lg ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <FiMenu size={24} />
          </button>

          <div className="flex-1 mx-4">
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              isDark ? "bg-gray-700" : "bg-gray-100"
            }`}>
              <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {user.username || "User"}
              </span>
              <button
                onClick={handleLogout}
                className={`p-2 rounded transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-red-400 hover:bg-gray-600"
                    : "text-gray-600 hover:text-red-600 hover:bg-gray-200"
                }`}
                title="Logout"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
