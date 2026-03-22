function getSeverityBadgeClass(severity) {
  if (severity === 'high' || severity === 'critical') {
    return 'bg-red-100 text-red-700'
  }

  if (severity === 'medium') {
    return 'bg-yellow-100 text-yellow-700'
  }

  return 'bg-green-100 text-green-700'
}

function Table({ complaints, onRowClick, selectedComplaintId }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white fade-in">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Summary</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Severity</th>
            <th className="px-4 py-3 font-medium">Sentiment</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr
              key={complaint.id}
              onClick={() => onRowClick?.(complaint.id)}
              className={`panel-transition border-b border-slate-100 last:border-b-0 ${
                selectedComplaintId === complaint.id ? 'bg-slate-100' : 'hover:bg-slate-50'
              } ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              <td className="px-4 py-3.5 text-slate-700">{complaint.summary}</td>
              <td className="px-4 py-3.5 text-slate-700">{complaint.category}</td>
              <td className="px-4 py-3 text-slate-700">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getSeverityBadgeClass(complaint.severity)}`}>
                  {complaint.severity}
                </span>
              </td>
              <td className="px-4 py-3.5 text-slate-700">{complaint.sentiment || '-'}</td>
              <td className="px-4 py-3.5 text-slate-700">{complaint.status}</td>
            </tr>
          ))}

          {complaints.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                No complaints found for the selected filters.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}

export default Table
