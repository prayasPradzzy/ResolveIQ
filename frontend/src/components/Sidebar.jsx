const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'submit', label: 'Submit Complaint', icon: 'submit' },
]

function NavIcon({ type }) {
  if (type === 'submit') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Sidebar({ activeView, onChangeView }) {
  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 md:h-screen md:w-72 md:border-b-0 md:border-r md:p-7">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Complaint IQ</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">Operations Panel</h1>
      </div>

      <nav className="flex gap-2 md:flex-col">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.key

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChangeView(item.key)}
              className={`panel-transition inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <NavIcon type={item.icon} />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
