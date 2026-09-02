import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function RingkasanMahasiswaPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: daftarTA } = await supabase
    .from("tugas_akhir")
    .select("id, judul, status_verifikasi, jumlah_dilihat, jumlah_diunduh")
    .eq("mahasiswa_id", user?.id)
    .order("created_at", { ascending: false });

  const rows = daftarTA ?? [];
  const totalDilihat = rows.reduce((sum, r) => sum + (r.jumlah_dilihat ?? 0), 0);
  const totalDiunduh = rows.reduce((sum, r) => sum + (r.jumlah_diunduh ?? 0), 0);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-primary-800">Ringkasan Mahasiswa</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatBox label="TA Diunggah" value={rows.length} />
        <StatBox label="Total Dilihat" value={totalDilihat} />
        <StatBox label="Total Diunduh" value={totalDiunduh} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-primary-800">TA Saya</p>
          <Link href="/dashboard/mahasiswa/status" className="text-xs text-accent-600 hover:underline">Lihat semua →</Link>
        </div>
        <ul className="space-y-2 text-sm">
          {rows.slice(0, 5).map((ta) => (
            <li key={ta.id} className="flex items-center justify-between border-t border-slate-100 py-2 first:border-t-0">
              <Link href={`/ta/${ta.id}`} className="font-medium text-primary-700 hover:underline">{ta.judul}</Link>
              {ta.status_verifikasi === "ditolak" ? (
                <span className="shrink-0 rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">Ditarik</span>
              ) : (
                <span className="shrink-0 rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Tayang</span>
              )}
            </li>
          ))}
          {rows.length === 0 && (
            <li className="text-slate-500">
              Kamu belum mengunggah TA. <Link href="/dashboard/mahasiswa/upload" className="text-accent-600 hover:underline">Unggah sekarang →</Link>
            </li>
          )}
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