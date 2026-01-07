import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  if (role === "admin" && user.role !== "admin") return <Navigate to="/login" />;
  if (role === "user" && user.role !== "user" && user.role !== "admin") return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
