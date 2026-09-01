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

      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-primary-800">Aktivitas Terbaru</p>
          <a href="/dashboard/admin/log" className="text-xs text-accent-600 hover:underline">Lihat semua →</a>
        </div>
        <ul className="space-y-1 text-sm">
          {(logTerbaru ?? []).map((l, i) => (
            <li key={i} className="border-t py-1.5 first:border-t-0">
              <span className="text-xs text-slate-400">{new Date(l.created_at).toLocaleString("id-ID")}</span> — {l.deskripsi ?? l.aksi}
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
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-2xl font-bold text-primary-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}