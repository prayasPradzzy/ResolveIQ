import { useEffect, useState } from 'react'

function SectionCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">{title}</h3>
      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{children}</div>
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
      <div className="space-y-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-6 fade-in shadow-sm">
        <div className="skeleton h-6 w-1/3 rounded mb-6" />
        <div className="skeleton h-24 rounded-xl" />
        <div className="skeleton h-20 rounded-xl" />
        <div className="skeleton h-32 rounded-xl" />
      </div>
    )
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-5 text-sm font-medium text-red-700 dark:text-red-300">{error}</div>
  }

  if (!detail) {
    return (
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-10 text-center text-sm text-slate-500 dark:text-slate-400 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <svg className="w-16 h-16 text-slate-200 dark:text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="font-semibold text-slate-600 dark:text-slate-300 text-lg">No Selection</p>
        <p className="mt-1 text-slate-400 dark:text-slate-500">Select a complaint row to view full details.</p>
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
          <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Category</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{detail.category || '-'}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Subcategory</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{detail.subcategory || '-'}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Severity</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{detail.severity || '-'}</p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-700 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Sentiment</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{detail.sentiment || '-'}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Entities">
        {detail.entities && detail.entities.length > 0 ? (
          <div className="space-y-2">
            {detail.entities.map((entity) => (
              <div key={entity.id} className="rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-700/30 p-3">
                <p className="text-slate-700 dark:text-slate-300"><span className="font-medium">Product:</span> {entity.product || '-'}</p>
                <p className="text-slate-700 dark:text-slate-300"><span className="font-medium">Issue Type:</span> {entity.issue_type || '-'}</p>
                <p className="text-slate-700 dark:text-slate-300"><span className="font-medium">Amount:</span> {entity.amount ?? '-'}</p>
                <p className="text-slate-700 dark:text-slate-300"><span className="font-medium">Date:</span> {entity.date || '-'}</p>
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
        <div className="relative">
          <textarea
            rows={6}
            value={responseDraft}
            onChange={(event) => setResponseDraft(event.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all mb-1 resize-y min-h-[120px]"
          />
        </div>
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={handleSend}
            className="panel-transition inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-700 dark:hover:bg-teal-600 hover:shadow-md hover:shadow-teal-600/20 focus:ring-4 focus:ring-teal-500/30 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            Send Response
          </button>
        </div>
      </SectionCard>
    </div>
  )
}

export default ComplaintDetailPanel
