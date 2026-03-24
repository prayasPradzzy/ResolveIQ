function AlertPanel({ alerts, loading, error }) {
  if (!loading && !error && alerts.length === 0) {
    return null; // hide if no alerts
  }

  return (
    <section className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 p-5 fade-in shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="inline-flex items-center gap-2 text-lg font-bold text-rose-800 dark:text-rose-200">
          <span className="p-1.5 bg-rose-100 dark:bg-rose-900/50 rounded-lg text-rose-600 dark:text-rose-400">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Action Required ({alerts.length})
        </h3>
      </div>

      {loading ? (
        <div className="mt-4 space-y-3">
          <div className="skeleton h-20 rounded-xl bg-rose-100 dark:bg-rose-900/30" />
          <div className="skeleton h-20 rounded-xl bg-rose-100 dark:bg-rose-900/30" />
        </div>
      ) : null}
      
      {error ? (
        <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-red-100 dark:border-red-900 text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {alerts.map((alert) => (
          <article key={alert.id} className="panel-transition relative rounded-xl border border-rose-200/60 dark:border-rose-900/40 bg-white dark:bg-slate-800 p-4 hover:-translate-y-1 hover:shadow-md hover:shadow-rose-100/50 dark:hover:shadow-rose-950/50 group cursor-pointer">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start gap-2 mb-2">
               <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
                 {alert.severity}
               </span>
               <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 px-2 py-0.5 rounded-md">Score: {alert.priority_score}</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">{alert.summary || 'Complaint alert'}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
               <svg className="w-3.5 h-3.5 text-rose-400 dark:text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               {alert.alert_reason}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AlertPanel
