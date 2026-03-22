function ComplaintCard({ title, value, icon }) {
  return (
    <article className="panel-transition rounded-xl border border-slate-200 bg-white p-5 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
        <span className="text-slate-400">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold leading-none text-slate-900">{value}</p>
    </article>
  )
}

export default ComplaintCard
