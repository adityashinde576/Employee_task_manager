import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export function StatCard({ icon: Icon, title, value, color = "blue" }) {
  const { isDark } = useContext(ThemeContext);
  const colorMap = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md transition-all ${
        isDark
          ? "bg-gray-800 text-white hover:shadow-lg"
          : "bg-white text-gray-900 hover:shadow-lg"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        {Icon && (
          <div className={`${colorMap[color]} p-4 rounded-lg text-white`}>
            <Icon size={32} />
          </div>
        )}
      </div>
    </div>
  );
}

export function LoadingSkeletons({ count = 3 }) {
  const { isDark } = useContext(ThemeContext);
  return (
    <div className="space-y-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`h-12 rounded animate-pulse ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          />
        ))}
    </div>
  );
}

export function EmptyState({ message = "No data available", icon: Icon }) {
  const { isDark } = useContext(ThemeContext);
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 rounded-lg border-2 border-dashed ${
        isDark
          ? "border-gray-700 bg-gray-800"
          : "border-gray-300 bg-gray-50"
      }`}
    >
      {Icon && <Icon size={48} className="text-gray-400 mb-4" />}
      <p
        className={`text-lg font-medium ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {message}
      </p>
    </div>
  );
}

export function RoleBadge({ role }) {
  const badges = {
    admin: "bg-red-100 text-red-800",
    user: "bg-blue-100 text-blue-800",
    moderator: "bg-purple-100 text-purple-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        badges[role] || "bg-gray-100 text-gray-800"
      }`}
    >
      {role?.charAt(0).toUpperCase() + role?.slice(1)}
    </span>
  );
}
