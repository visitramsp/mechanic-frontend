export const StatCard = ({ label, value, sub, color = "text-[#0a1628]" }) => (
  <div className="min-w-0 rounded-2xl border border-[#dce4ef] bg-[#ffffff] p-4 shadow-[0_12px_34px_rgba(10,22,40,.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(10,22,40,.12)]">
    <div className="mb-1 break-words text-[10px] font-bold uppercase tracking-[.18em] text-[#667085]">{label}</div>
    <div className={`break-words font-mono text-2xl font-bold ${color}`}>{value}</div>
    {sub && <div className="mt-1 break-words text-xs text-[#667085]">{sub}</div>}
  </div>
);

export const StatStrip = ({ stats }) => (
  <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {stats.map((stat, index) => <StatCard key={index} {...stat} />)}
  </div>
);

export const EmptyState = ({ icon, title, sub }) => (
  <div className="px-5 py-16 text-center">
    <div className="mb-4 text-5xl opacity-25">{icon}</div>
    <div className="mb-1 font-serif text-lg font-bold text-[#344054]">{title}</div>
    <div className="text-sm text-[#667085]">{sub}</div>
  </div>
);

export const RegPlate = ({ reg }) => (
  <span className="inline-block rounded-md border border-[#d6a800] bg-[#f7d117] px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-black">
    {reg}
  </span>
);

export const TableCard = ({ title, count, children }) => (
  <div className="min-w-0 overflow-hidden rounded-2xl border border-[#dce4ef] bg-[#ffffff] shadow-[0_12px_34px_rgba(10,22,40,.08)]">
    <div className="flex flex-col gap-1 border-b border-[#e5eaf2] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="break-words text-sm font-bold text-[#111c34]">{title}</div>
      <div className="text-xs text-[#667085]">{count} records</div>
    </div>
    <div className="overflow-x-auto">{children}</div>
  </div>
);

export const PageHeader = ({ icon, title, sub, action }) => (
  <div className="mb-7 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      <div className="flex items-center gap-2 break-words font-serif text-2xl font-bold text-[#111c34]">
        <span className="text-lg">{icon}</span>
        {title}
      </div>
      <div className="mt-1 break-words text-sm text-[#667085]">{sub}</div>
    </div>
    {action && <div className="w-full sm:w-auto [&>button]:w-full sm:[&>button]:w-auto">{action}</div>}
  </div>
);
