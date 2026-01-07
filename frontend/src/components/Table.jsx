export default function Table({ columns, data, actions, onSort, sortConfig }) {
  const handleSort = (col) => {
    if (onSort) onSort(col);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 bg-white">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="border p-3 text-left font-bold cursor-pointer hover:bg-gray-300"
                onClick={() => handleSort(col)}
              >
                {col}
                {sortConfig?.key === col && (
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
            {actions && <th className="border p-3 text-left font-bold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="border p-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="border p-3">
                    {row[col]}
                  </td>
                ))}
                {actions && (
                  <td className="border p-3 flex gap-2">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
