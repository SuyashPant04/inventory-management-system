function EmptyState({
  icon = "📭",
  title = "No data found",
  message = "There are no items to display."
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-6xl mb-4">{icon}</div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>

      <p className="text-gray-600 text-center max-w-sm">
        {message}
      </p>
    </div>
  );
}

function Table({ columns, data, renderRow, className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse ${className}`}>
        <thead>
          <tr className="bg-gray-100 border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data && data.length > 0 ? (
            data.map((row, index) => renderRow(row, index))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export { EmptyState };
export default Table;