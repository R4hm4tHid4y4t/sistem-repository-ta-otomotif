import { LABEL_JENIS_DOC } from "@/lib/klasifikasi";

export default function EksporAdminPage() {
  const tahunIni = new Date().getFullYear();

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-primary-800">Ekspor Excel</h1>
      <p className="mb-4 text-sm text-slate-500">
        Unduh rekap karya per jenis dokumen. Pilih "Semua jenis" untuk satu file dengan sheet terpisah per jenis.
      </p>

      <form
        method="GET"
        action="/api/ekspor/admin"
        className="max-w-lg space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-primary-800">Jenis Dokumen</span>
          <select name="jenis" defaultValue="semua" className="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="semua">Semua jenis (sheet terpisah)</option>
            {Object.entries(LABEL_JENIS_DOC).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-primary-800">Dari Tahun (opsional)</span>
            <input name="dari" type="number" placeholder="2016" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-primary-800">Sampai Tahun (opsional)</span>
            <input name="sampai" type="number" placeholder={String(tahunIni)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
        </div>

        <button className="rounded-lg bg-accent-500 px-5 py-2 font-medium text-white hover:bg-accent-600">
          ⬇ Unduh Excel
        </button>
      </form>
    </div>
  );
}