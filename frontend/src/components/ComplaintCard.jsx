function ComplaintCard({ title, value, icon }) {
  const isCritical = title.toLowerCase() === 'critical';
  const isOpen = title.toLowerCase() === 'open';

  let colorClasses = "bg-white border-slate-200";
  let iconColor = "text-slate-400 bg-slate-50";
  
  if (isCritical) {
    colorClasses = "bg-gradient-to-br from-red-50 to-white border-red-100";
    iconColor = "text-red-600 bg-red-100/50";
  } else if (isOpen) {
    colorClasses = "bg-gradient-to-br from-amber-50 to-white border-amber-100";
    iconColor = "text-amber-600 bg-amber-100/50";
  } else {
    colorClasses = "bg-gradient-to-br from-teal-50 to-white border-teal-100";
    iconColor = "text-teal-600 bg-teal-100/50";
  }

  return (
    <article className={`panel-transition relative overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 ${colorClasses}`}>
      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
          <p className={`text-4xl font-black tracking-tight ${isCritical ? 'text-red-700' : 'text-slate-800'}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${iconColor} shadow-sm`}>
          {icon}
        </div>
      </div>
    </article>
  )
}

export default ComplaintCard
