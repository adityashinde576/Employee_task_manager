import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export function UserStatsChart({ data = [] }) {
  const { isDark } = useContext(ThemeContext);
  
  const chartData = [
    { name: "Total Users", value: data.length || 0 },
    { name: "Admins", value: data.filter(u => u.role === "admin").length || 0 },
    { name: "Regular Users", value: data.filter(u => u.role === "user").length || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} />
        <XAxis stroke={isDark ? "#9CA3AF" : "#6B7280"} />
        <YAxis stroke={isDark ? "#9CA3AF" : "#6B7280"} />
        <Tooltip contentStyle={{ backgroundColor: isDark ? "#1F2937" : "#FFFFFF", border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}` }} />
        <Legend />
        <Bar dataKey="value" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TaskStatsChart({ data = [] }) {
  const { isDark } = useContext(ThemeContext);
  
  const chartData = [
    { name: "Pending", value: data.filter(t => t.status === "Pending").length || 0 },
    { name: "In Progress", value: data.filter(t => t.status === "In Progress").length || 0 },
    { name: "Completed", value: data.filter(t => t.status === "Completed").length || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: isDark ? "#1F2937" : "#FFFFFF", border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}` }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ActivityTrendChart({ data = [] }) {
  const { isDark } = useContext(ThemeContext);
  
  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      activities: Math.floor(Math.random() * 50) + 10,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={last7Days}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#E5E7EB"} />
        <XAxis stroke={isDark ? "#9CA3AF" : "#6B7280"} />
        <YAxis stroke={isDark ? "#9CA3AF" : "#6B7280"} />
        <Tooltip contentStyle={{ backgroundColor: isDark ? "#1F2937" : "#FFFFFF", border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}` }} />
        <Legend />
        <Line type="monotone" dataKey="activities" stroke="#3B82F6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
