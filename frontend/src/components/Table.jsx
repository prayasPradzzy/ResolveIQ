function getSeverityBadgeClass(severity) {
  if (severity === 'high' || severity === 'critical') {
    return 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 shadow-sm'
  }

  if (severity === 'medium') {
    return 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 shadow-sm'
  }

  return 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800 shadow-sm'
}

function Table({ complaints, onRowClick, selectedComplaintId }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm fade-in pb-1">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-xs font-semibold">
          <tr>
            <th className="px-4 py-4 break-words w-2/5">Summary</th>
            <th className="px-4 py-4">Category</th>
            <th className="px-4 py-4">Severity</th>
            <th className="px-4 py-4">Sentiment</th>
            <th className="px-4 py-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint, idx) => (
            <tr
              key={complaint.id}
              onClick={() => onRowClick?.(complaint.id)}
              className={`panel-transition border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-900/50'} ${
                selectedComplaintId === complaint.id ? 'bg-teal-50 dark:bg-teal-950/40 ring-1 ring-teal-200 dark:ring-teal-700 z-10 relative' : 'hover:bg-teal-50/30 dark:hover:bg-teal-900/20 hover:shadow-sm'
              } ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100 line-clamp-2 leading-relaxed">{complaint.summary}</td>
              <td className="px-4 py-4 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap"><span className="inline-flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>{complaint.category}</span></td>
              <td className="px-4 py-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                <span className={`rounded-md px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide border ${getSeverityBadgeClass(complaint.severity)}`}>
                  {complaint.severity}
                </span>
              </td>
              <td className="px-4 py-4 text-slate-600 dark:text-slate-400 capitalize whitespace-nowrap">{complaint.sentiment || '-'}</td>
              <td className="px-4 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600"></span>{complaint.status}</span></td>
            </tr>
          ))}

          {complaints.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                <div className="flex flex-col items-center gap-3">
                  <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  <p className="font-medium text-sm">No complaints found for the selected filters.</p>
                </div>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}

export default Table
