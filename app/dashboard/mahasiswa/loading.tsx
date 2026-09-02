export default function DashboardLoading() {
  return (
    <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-slate-100 bg-white">
      <div className="flex flex-col items-center">
        <span className="h-6 w-6 animate-spin rounded-full border-b-2 border-accent-500"></span>
        <p className="mt-4 text-sm text-slate-400">Memuat data...</p>
      </div>
    </div>
  );
}