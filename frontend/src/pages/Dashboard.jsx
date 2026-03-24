import { useEffect, useMemo, useState } from 'react'
import AlertPanel from '../components/AlertPanel'
import ComplaintCard from '../components/ComplaintCard'
import ComplaintDetailPanel from '../components/ComplaintDetailPanel'
import Table from '../components/Table'
import { getAlerts, getComplaintById, getComplaints } from '../services/apiClient'

function Dashboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    severity: '',
    category: '',
  })
  const [selectedComplaintId, setSelectedComplaintId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [alerts, setAlerts] = useState([])
  const [alertsLoading, setAlertsLoading] = useState(true)
  const [alertsError, setAlertsError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadComplaints() {
      setLoading(true)
      setError('')

      try {
        const data = await getComplaints(filters)

        if (isActive) {
          setComplaints(data)
        }
      } catch (requestError) {
        if (isActive) {
          setError(requestError.message)
          setComplaints([])
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadComplaints()

    return () => {
      isActive = false
    }
  }, [filters])

  useEffect(() => {
    let isActive = true

    async function loadAlerts() {
      setAlertsLoading(true)
      setAlertsError('')

      try {
        const data = await getAlerts()

        if (isActive) {
          setAlerts(data)
        }
      } catch (requestError) {
        if (isActive) {
          setAlerts([])
          setAlertsError(requestError.message)
        }
      } finally {
        if (isActive) {
          setAlertsLoading(false)
        }
      }
    }

    loadAlerts()

    return () => {
      isActive = false
    }
  }, [complaints])

  const categoryOptions = useMemo(() => {
    const categories = new Set(complaints.map((item) => item.category).filter(Boolean))
    return Array.from(categories).sort()
  }, [complaints])

  const criticalCount = complaints.filter((item) => item.severity === 'critical').length
  const openCount = complaints.filter((item) => item.status === 'open').length

  function CardIcon({ type }) {
    if (type === 'critical') {
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 8v5m0 3h.01" strokeLinecap="round" />
          <path d="M10.3 3.8 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }

    if (type === 'open') {
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
    }

    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 7h8M8 12h8M8 17h5" strokeLinecap="round" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    )
  }

  useEffect(() => {
    if (!selectedComplaintId) {
      setDetail(null)
      return
    }

    let isActive = true

    async function loadComplaintDetail() {
      setDetailLoading(true)
      setDetailError('')

      try {
        const data = await getComplaintById(selectedComplaintId)

        if (isActive) {
          setDetail(data)
        }
      } catch (requestError) {
        if (isActive) {
          setDetail(null)
          setDetailError(requestError.message)
        }
      } finally {
        if (isActive) {
          setDetailLoading(false)
        }
      }
    }

    loadComplaintDetail()

    return () => {
      isActive = false
    }
  }, [selectedComplaintId])

  return (
    <section className="space-y-8">
      {/* Top Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/30 backdrop-blur pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div>
          <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <span className="hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer transition-colors">Home</span>
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-teal-600 dark:text-teal-400">Dashboard</span>
          </nav>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard Overview</h2>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-auto hidden sm:flex">
           <button className="relative p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
           </button>
           <div className="h-8 w-8 bg-gradient-to-tr from-teal-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-800">
             AU
           </div>
        </div>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ComplaintCard title="Total Complaints" value={complaints.length} icon={<CardIcon type="total" />} />
        <ComplaintCard title="Critical" value={criticalCount} icon={<CardIcon type="critical" />} />
        <ComplaintCard title="Open" value={openCount} icon={<CardIcon type="open" />} />
      </div>

      <AlertPanel alerts={alerts} loading={alertsLoading} error={alertsError} />

      <div className="grid gap-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5 shadow-sm sm:grid-cols-2 lg:w-2/3 xl:w-1/2">
        <label className="text-sm text-slate-700 dark:text-slate-300 block">
          <span className="mb-1.5 block font-semibold text-slate-800 dark:text-slate-200">Filter by Severity</span>
          <select
            value={filters.severity}
            onChange={(event) => setFilters((previous) => ({ ...previous, severity: event.target.value }))}
            className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 shadow-sm"
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </label>

        <label className="text-sm text-slate-700 dark:text-slate-300 block">
          <span className="mb-1.5 block font-semibold text-slate-800 dark:text-slate-200">Filter by Category</span>
          <select
            value={filters.category}
            onChange={(event) => setFilters((previous) => ({ ...previous, category: event.target.value }))}
            className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 shadow-sm"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        {loading ? (
          <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
            <div className="flex gap-4 mb-8">
              <div className="skeleton h-10 w-1/4 rounded-lg" />
              <div className="skeleton h-10 w-1/4 rounded-lg" />
            </div>
            {[1,2,3,4,5].map(i => (
               <div key={i} className="flex gap-4">
                 <div className="skeleton h-12 w-full rounded-xl" />
               </div>
            ))}
          </div>
        ) : (
          <Table
            complaints={complaints}
            onRowClick={setSelectedComplaintId}
            selectedComplaintId={selectedComplaintId}
          />
        )}

        <ComplaintDetailPanel detail={detail} loading={detailLoading} error={detailError} />
      </div>
    </section>
  )
}

export default Dashboard
