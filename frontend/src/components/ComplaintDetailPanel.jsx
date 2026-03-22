import { useEffect, useState } from 'react'

function SectionCard({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 text-sm text-slate-700">{children}</div>
    </section>
  )
}

function ComplaintDetailPanel({ detail, loading, error }) {
  const [responseDraft, setResponseDraft] = useState('')

  useEffect(() => {
    setResponseDraft(detail?.response?.edited_response || detail?.response?.generated_response || '')
  }, [detail])

  function handleSend() {
    window.alert('Mock send: response queued for delivery.')
  }

  if (loading) {
    return (
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 fade-in">
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-20 rounded-lg" />
        <div className="skeleton h-16 rounded-lg" />
        <div className="skeleton h-20 rounded-lg" />
      </div>
    )
  }

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
  }

  if (!detail) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Select a complaint row to view full details.
      </div>
    )
  }

  return (
    <div className="space-y-4 fade-in">
      <SectionCard title="Full Complaint Text">
        <p className="leading-relaxed">{detail.raw_text || '-'}</p>
      </SectionCard>

      <SectionCard title="AI Outputs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Category</p>
            <p className="mt-1 font-medium text-slate-900">{detail.category || '-'}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Subcategory</p>
            <p className="mt-1 font-medium text-slate-900">{detail.subcategory || '-'}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Severity</p>
            <p className="mt-1 font-medium text-slate-900">{detail.severity || '-'}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Sentiment</p>
            <p className="mt-1 font-medium text-slate-900">{detail.sentiment || '-'}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Entities">
        {detail.entities && detail.entities.length > 0 ? (
          <div className="space-y-2">
            {detail.entities.map((entity) => (
              <div key={entity.id} className="rounded-lg border border-slate-200 p-3">
                <p><span className="font-medium">Product:</span> {entity.product || '-'}</p>
                <p><span className="font-medium">Issue Type:</span> {entity.issue_type || '-'}</p>
                <p><span className="font-medium">Amount:</span> {entity.amount ?? '-'}</p>
                <p><span className="font-medium">Date:</span> {entity.date || '-'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No entities extracted.</p>
        )}
      </SectionCard>

      <SectionCard title="Summary">
        <p>{detail.summary || '-'}</p>
      </SectionCard>

      <SectionCard title="Generated Response">
        <textarea
          rows={6}
          value={responseDraft}
          onChange={(event) => setResponseDraft(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
        />

        <button
          type="button"
          onClick={handleSend}
          className="panel-transition mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Send
        </button>
      </SectionCard>
    </div>
  )
}

export default ComplaintDetailPanel
