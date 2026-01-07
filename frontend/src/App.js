import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import MyTasks from "./pages/user/MyTasks";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./context/ThemeContext";

function AppLayout({ children, initialTab }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role === "admin" ? "admin" : "user";

  return (
    <div className="flex flex-col h-screen">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AppLayout>
                  <AdminDashboard initialTab="dashboard" />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AppLayout>
                  <AdminDashboard initialTab="users" />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tasks"
            element={
              <ProtectedRoute role="admin">
                <AppLayout>
                  <AdminDashboard initialTab="tasks" />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute role="user">
                <AppLayout>
                  <EmployeeDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/my-tasks"
            element={
              <ProtectedRoute role="user">
                <AppLayout>
                  <MyTasks />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
