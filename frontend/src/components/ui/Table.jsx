import "./Table.css";

/**
 * Reusable table component.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.columns - Table column definitions.
 * @param {Array} props.data - Table data.
 * @returns {JSX.Element}
 */
export default function Table({ columns = [], data = [] }) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
        <tr>
            {columns.map((column) => (
            <th
                key={column.accessor}
                style={{ width: column.width }}
            >
                {column.header}
            </th>
            ))}
        </tr>
        </thead>

        <tbody>
        {data.length > 0 ? (
            data.map((row) => (
            <tr key={row.stock_id}>
                {columns.map((column) => (
                <td key={column.accessor}>
                    {column.render
                    ? column.render(row)
                    : row[column.accessor]}
                </td>
                ))}
            </tr>
            ))
        ) : (
            <tr>
            <td colSpan={columns.length} className="empty-table">
                No data available.
            </td>
            </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}