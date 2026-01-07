export const exportToCSV = (data, filename = "export.csv") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const fetchActivityLogs = async () => {
  try {
    const logs = JSON.parse(localStorage.getItem("activityLogs") || "[]");
    return logs;
  } catch {
    return [];
  }
};

export const addActivityLog = (action, details) => {
  const logs = JSON.parse(localStorage.getItem("activityLogs") || "[]");
  logs.push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    action,
    details,
  });
  localStorage.setItem("activityLogs", JSON.stringify(logs.slice(-50)));
};

