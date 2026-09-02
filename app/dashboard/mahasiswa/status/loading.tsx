export default function Loading() {
  return (
    <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col items-center">
        {/* Lingkaran berputar (Spinner) */}
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-accent-500"></span>
        <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">Memuat data...</p>
      </div>
    </div>
  );
}