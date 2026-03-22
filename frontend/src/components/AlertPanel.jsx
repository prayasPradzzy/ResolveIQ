function AlertPanel({ alerts, loading, error }) {
  return (
    <section className="rounded-xl border border-red-200 bg-red-50 p-4 fade-in">
      <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-red-800">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 8v5m0 3h.01" strokeLinecap="round" />
          <path d="M10.3 3.8 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Alerts
      </h3>

      {loading ? (
        <div className="mt-3 space-y-2">
          <div className="skeleton h-16 rounded-lg" />
          <div className="skeleton h-16 rounded-lg" />
        </div>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}

      {!loading && !error && alerts.length === 0 ? (
        <p className="mt-2 text-sm text-red-700">No active alerts.</p>
      ) : null}

      <div className="mt-3 space-y-2">
        {alerts.map((alert) => (
          <article key={alert.id} className="panel-transition rounded-lg border border-red-200 bg-white p-3 hover:shadow-sm">
            <p className="text-sm font-medium text-red-800">{alert.summary || 'Complaint alert'}</p>
            <p className="mt-1 text-xs text-red-700">Reason: {alert.alert_reason}</p>
            <p className="mt-1 text-xs text-red-600">
              Severity: {alert.severity} | Sentiment: {alert.sentiment} | Priority: {alert.priority_score}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AlertPanel
