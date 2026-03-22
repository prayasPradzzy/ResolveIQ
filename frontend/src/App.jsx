import { useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Submit from './pages/Submit'

function App() {
  const [activeView, setActiveView] = useState('dashboard')

  const pageContent = useMemo(() => {
    if (activeView === 'submit') {
      return <Submit />
    }

    return <Dashboard />
  }, [activeView])

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row">
        <Sidebar activeView={activeView} onChangeView={setActiveView} />

        <section className="flex-1 px-4 py-6 md:px-10 md:py-10 fade-in">
          {pageContent}
        </section>
      </div>
    </main>
  )
}

export default App
