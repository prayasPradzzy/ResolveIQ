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
    <section className="space-y-6">
      <header>
        <h2 className="text-3xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-1.5 text-sm text-slate-600">Review complaint trends and current operational load.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ComplaintCard title="Total Complaints" value={complaints.length} icon={<CardIcon type="total" />} />
        <ComplaintCard title="Critical" value={criticalCount} icon={<CardIcon type="critical" />} />
        <ComplaintCard title="Open" value={openCount} icon={<CardIcon type="open" />} />
      </div>

      <AlertPanel alerts={alerts} loading={alertsLoading} error={alertsError} />

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <label className="text-sm text-slate-700">
          <span className="mb-1 block font-medium">Severity</span>
          <select
            value={filters.severity}
            onChange={(event) => setFilters((previous) => ({ ...previous, severity: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </label>

        <label className="text-sm text-slate-700">
          <span className="mb-1 block font-medium">Category</span>
          <select
            value={filters.category}
            onChange={(event) => setFilters((previous) => ({ ...previous, category: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        {loading ? (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
            <div className="skeleton h-4 w-1/4 rounded" />
            <div className="skeleton h-10 rounded" />
            <div className="skeleton h-10 rounded" />
            <div className="skeleton h-10 rounded" />
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
