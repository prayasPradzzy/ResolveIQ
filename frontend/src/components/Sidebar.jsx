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
    <>
      <aside className="hidden md:flex flex-col w-full border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-7 md:h-screen md:w-72 shadow-sm dark:shadow-lg relative z-20">
        <div className="mb-10 flex flex-col items-start gap-3">
          <div className="h-10 w-10 bg-teal-600 text-white rounded-xl shadow-md flex items-center justify-center font-bold text-xl">
            CQ
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Complaint IQ</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">Operations Panel</h1>
          </div>
        </div>

        <nav className="flex flex-col gap-2.5 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.key

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onChangeView(item.key)}
                className={`panel-transition inline-flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 translate-x-1'
                    : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:translate-x-1'
                }`}
              >
                <NavIcon type={item.icon} />
                {item.label}
              </button>
            )
          })}
        </nav>
        
        <div className="mt-auto border-t border-slate-100 dark:border-slate-700 pt-6">
           <div className="flex items-center gap-3">
             <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
               <svg className="h-5 w-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <div>
               <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Admin User</p>
               <p className="text-xs text-slate-500 dark:text-slate-400">View Profile</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 flex justify-around p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.5)]">
         {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.key

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onChangeView(item.key)}
                className={`panel-transition flex flex-col items-center gap-1 rounded-xl p-3 flex-1 text-xs font-semibold ${
                  isActive
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
                  <NavIcon type={item.icon} />
                </div>
                {item.label}
              </button>
            )
          })}
      </nav>
    </>
  )
}

export default Sidebar
