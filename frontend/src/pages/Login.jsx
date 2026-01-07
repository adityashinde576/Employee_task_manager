import { useState, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMoon, FiSun } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";

export default function Login() {
  const [username_or_email, setU] = useState("");
  const [password, setP] = useState("");
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useContext(ThemeContext);

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/login", {
        username_or_email,
        password,
      });

      // Clear any existing user data
      localStorage.removeItem("user");
      
      // Store new user data
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }

      toast.success("Login successful");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDark
        ? "bg-gradient-to-br from-gray-900 to-gray-800"
        : "bg-gradient-to-br from-blue-500 to-blue-700"
    }`}>
      <button
        onClick={toggleDarkMode}
        className={`absolute top-6 right-6 p-3 rounded-lg transition-colors ${
          isDark
            ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
            : "bg-white/20 text-white hover:bg-white/30"
        }`}
        title={isDark ? "Light Mode" : "Dark Mode"}
      >
        {isDark ? <FiSun size={24} /> : <FiMoon size={24} />}
      </button>

      <div className={`p-8 rounded-2xl shadow-2xl w-96 ${
        isDark
          ? "bg-gray-800 border border-gray-700"
          : "bg-white"
      }`}>
        <h1 className={`text-4xl font-bold mb-2 text-center ${
          isDark ? "text-blue-400" : "text-blue-600"
        }`}>
          Task Manager
        </h1>
        <h2 className={`text-lg font-semibold mb-8 text-center ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}>
          Login to your account
        </h2>
        
        <input
          type="text"
          className={`w-full px-4 py-3 rounded-lg mb-4 border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
          }`}
          placeholder="Username or Email"
          value={username_or_email}
          onChange={(e) => setU(e.target.value)}
        />
        <input
          type="password"
          className={`w-full px-4 py-3 rounded-lg mb-6 border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
          }`}
          placeholder="Password"
          value={password}
          onChange={(e) => setP(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
        >
          Login
        </button>
        
        <div className={`mt-6 p-4 rounded-lg text-sm ${
          isDark
            ? "bg-gray-700 text-gray-300"
            : "bg-gray-100 text-gray-700"
        }`}>
          <p className="font-semibold mb-2">📋 Demo Credentials:</p>
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>User:</strong> user / user123</p>
        </div>
      </div>
    </div>
  );
}
