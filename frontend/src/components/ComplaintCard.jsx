function ComplaintCard({ title, value, icon }) {
  const isCritical = title.toLowerCase() === 'critical';
  const isOpen = title.toLowerCase() === 'open';

  let colorClasses = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700";
  let iconColor = "text-slate-400 bg-slate-50 dark:text-slate-500 dark:bg-slate-700";
  
  if (isCritical) {
    colorClasses = "bg-gradient-to-br from-red-50 dark:from-red-950/50 to-white dark:to-slate-800 border-red-100 dark:border-red-900";
    iconColor = "text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/30";
  } else if (isOpen) {
    colorClasses = "bg-gradient-to-br from-amber-50 dark:from-amber-950/50 to-white dark:to-slate-800 border-amber-100 dark:border-amber-900";
    iconColor = "text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/30";
  } else {
    colorClasses = "bg-gradient-to-br from-teal-50 dark:from-teal-950/50 to-white dark:to-slate-800 border-teal-100 dark:border-teal-900";
    iconColor = "text-teal-600 dark:text-teal-400 bg-teal-100/50 dark:bg-teal-900/30";
  }

  return (
    <article className={`panel-transition relative overflow-hidden rounded-2xl border p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_10px_-4px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 ${colorClasses}`}>
      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`text-4xl font-black tracking-tight ${isCritical ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>
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
