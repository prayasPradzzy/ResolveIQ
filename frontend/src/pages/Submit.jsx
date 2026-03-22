import { useState } from 'react'
import { submitComplaint } from '../services/apiClient'

function PageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 4h8l4 4v12H6z" strokeLinejoin="round" />
      <path d="M14 4v4h4M9 13h6M9 17h6" strokeLinecap="round" />
    </svg>
  )
}

function ResultCard({ label, value }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-slate-900">{value || '-'}</p>
    </article>
  )
}

function Submit() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const normalizedText = text.trim().replace(/\s+/g, ' ')

    if (!normalizedText) {
      setError('Please enter complaint text before submitting.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const payload = await submitComplaint(normalizedText)
      setResult(payload)
      setText('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6 fade-in">
      <header>
        <div className="inline-flex items-center gap-2 text-slate-700">
          <PageIcon />
          <h2 className="text-3xl font-semibold text-slate-900">Submit Complaint</h2>
        </div>
        <p className="mt-1.5 text-sm text-slate-600">Paste customer complaint text to run AI analysis.</p>
      </header>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6">
        <label htmlFor="complaint" className="mb-2 block text-sm font-medium text-slate-700">
          Complaint Text
        </label>
        <textarea
          id="complaint"
          rows={8}
          placeholder="Enter complaint details..."
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none panel-transition focus:border-slate-500"
        />

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="panel-transition mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </>
          ) : (
            'Analyze Complaint'
          )}
        </button>
      </form>

      {result ? (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">AI Analysis Result</h3>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard label="Category" value={result.complaint?.category} />
            <ResultCard label="Sentiment" value={result.complaint?.sentiment} />
            <ResultCard label="Severity" value={result.complaint?.severity} />
            <ResultCard label="Summary" value={result.complaint?.summary} />
          </div>

          <ResultCard
            label="Generated Response"
            value={result.response?.edited_response || result.response?.generated_response}
          />
        </section>
      ) : null}
    </section>
  )
}

export default Submit
