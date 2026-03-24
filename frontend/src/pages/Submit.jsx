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
    <article className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-sm text-slate-900 dark:text-slate-100">{value || '-'}</p>
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
    <section className="space-y-8 fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/30 backdrop-blur pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div>
          <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <span className="hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer transition-colors">Home</span>
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-teal-600 dark:text-teal-400">Submit Complaint</span>
          </nav>
          <div className="inline-flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 rounded-lg">
              <PageIcon />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Submit Complaint</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium max-w-xl">Paste customer complaint text to run AI analysis, extract sentiment & categorize automatically.</p>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-auto hidden sm:flex">
           <div className="h-8 w-8 bg-gradient-to-tr from-teal-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-800">
             AU
           </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-end mb-2">
          <label htmlFor="complaint" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Complaint Text
          </label>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{text.length} characters</span>
        </div>
        
        <textarea
          id="complaint"
          rows={8}
          placeholder="e.g. 'I received my order yesterday but the item was completely broken and the packaging was torn...'"
          value={text}
          onChange={(event) => setText(event.target.value)}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none panel-transition focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${error ? 'border-red-500 dark:border-red-600' : 'border-slate-300 dark:border-slate-600'}`}
        />

        {error ? (
          <div className="mt-3 flex items-center gap-1 text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/30 p-2 rounded-md">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="panel-transition mt-4 inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-lg bg-teal-600 dark:bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 dark:hover:bg-teal-600 focus:ring-4 focus:ring-teal-500/30 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 shadow-sm"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing Analysis...
            </>
          ) : (
            'Analyze Complaint'
          )}
        </button>
      </form>

      {result ? (
        <section className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Analysis Result</h3>

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
