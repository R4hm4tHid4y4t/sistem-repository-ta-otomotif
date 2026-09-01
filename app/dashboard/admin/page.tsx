import { createClient } from "@/lib/supabase/server";

export default async function RingkasanAdminPage() {
  const supabase = createClient();

  const [
    { count: taTayang },
    { count: taDitarik },
    { count: mahasiswaCount },
    { count: dosenCount },
    { data: logTerbaru },
  ] = await Promise.all([
    supabase.from("tugas_akhir").select("*", { count: "exact", head: true }).eq("status_verifikasi", "diterima"),
    supabase.from("tugas_akhir").select("*", { count: "exact", head: true }).eq("status_verifikasi", "ditolak"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "mahasiswa"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "dosen"),
    supabase.from("log_aktivitas").select("aksi, deskripsi, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-primary-800">Ringkasan Admin</h1>
      <div className="grid gap-4 sm:grid-cols-4">
        <StatBox label="TA Tayang" value={taTayang ?? 0} />
        <StatBox label="TA Ditarik" value={taDitarik ?? 0} />
        <StatBox label="Mahasiswa Terdaftar" value={mahasiswaCount ?? 0} />
        <StatBox label="Dosen Terdaftar" value={dosenCount ?? 0} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-primary-800">Aktivitas Terbaru</p>
          <a href="/dashboard/admin/log" className="text-xs text-accent-600 hover:underline">Lihat semua →</a>
        </div>
        <ul className="space-y-1 text-sm">
          {(logTerbaru ?? []).map((l, i) => (
            <li key={i} className="flex items-center justify-between border-t py-1.5 first:border-t-0">
              <span>
                <span className="text-xs text-slate-400">{new Date(l.created_at).toLocaleString("id-ID")}</span> — {l.deskripsi ?? l.aksi}
              </span>
              {l.aksi === "upload_ta" && (
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Tayang</span>
              )}
            </li>
          ))}
          {(logTerbaru ?? []).length === 0 && <li className="text-slate-500">Belum ada aktivitas.</li>}
        </ul>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-2xl font-bold text-primary-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}