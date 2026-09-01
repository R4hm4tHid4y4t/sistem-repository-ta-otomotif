// Use case: "Melihat Rekap Dosen & Ekspor Excel" (extend dari Dashboard Statistik)
import { createClient } from "@/lib/supabase/server";

export default async function RekapDosenPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: semuaTA } = await supabase
    .from("tugas_akhir")
    .select("id, judul, tahun, status_verifikasi, dosen_pembimbing_id, dosen_pembimbing_2_id, dosen_penguji_1_id, dosen_penguji_2_id")
    .or(
      `dosen_pembimbing_id.eq.${user.id},dosen_pembimbing_2_id.eq.${user.id},dosen_penguji_1_id.eq.${user.id},dosen_penguji_2_id.eq.${user.id}`
    )
    .order("tahun", { ascending: false });

  const rows = semuaTA ?? [];
  const bimbingan = rows.filter((r) => r.dosen_pembimbing_id === user.id || r.dosen_pembimbing_2_id === user.id);
  const diuji = rows.filter((r) => r.dosen_penguji_1_id === user.id || r.dosen_penguji_2_id === user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary-800">Rekap TA</h1>
        <a href="/api/ekspor/rekap-dosen" className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600">
          ⬇ Ekspor Excel
        </a>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold text-primary-800">TA yang Dibimbing</h2>
        <RekapTable rows={bimbingan} />
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold text-primary-800">TA yang Diuji</h2>
        <RekapTable rows={diuji} />
      </div>
    </div>
  );
}

function RekapTable({ rows }: { rows: { id: string; judul: string; tahun: number; status_verifikasi: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="p-3">Judul</th>
            <th className="p-3">Tahun</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((ta) => (
            <tr key={ta.id} className="border-t border-slate-100">
              <td className="p-3 font-medium text-primary-800">
                <a href={`/ta/${ta.id}`} className="hover:underline">{ta.judul}</a>
              </td>
              <td className="p-3">{ta.tahun}</td>
              <td className="p-3">
                {ta.status_verifikasi === "ditolak" ? (
                  <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">Ditarik</span>
                ) : (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Tayang</span>
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={3} className="p-3 text-slate-500">Belum ada data.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}