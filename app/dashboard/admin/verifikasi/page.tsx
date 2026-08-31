// Kelola TA — admin bisa takedown TA yang sudah tayang (bukan lagi antrean persetujuan)
import { createClient } from "@/lib/supabase/server";
import { verifikasiTugasAkhir } from "@/lib/actions/ta";

export default async function KelolaTAPage() {
  const supabase = createClient();
  const { data: daftarTA } = await supabase
    .from("tugas_akhir")
    .select("id, judul, tahun, status_verifikasi, mahasiswa:profiles!tugas_akhir_mahasiswa_id_fkey(nama_lengkap)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-primary-800">Kelola TA</h1>
      <div className="overflow-x-auto rounded border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Judul</th>
              <th className="p-3">Penulis</th>
              <th className="p-3">Tahun</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(daftarTA ?? []).map((ta: any) => (
              <tr key={ta.id} className="border-t">
                <td className="p-3 font-medium text-primary-800">
                  <a href={`/ta/${ta.id}`} className="hover:underline">{ta.judul}</a>
                </td>
                <td className="p-3">{ta.mahasiswa?.nama_lengkap}</td>
                <td className="p-3">{ta.tahun}</td>
                <td className="p-3">
                  {ta.status_verifikasi === "ditolak" ? (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">Ditarik</span>
                  ) : (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Tayang</span>
                  )}
                </td>
                <td className="p-3">
                  {ta.status_verifikasi === "ditolak" ? (
                    <form action={verifikasiTugasAkhir.bind(null, ta.id, "diterima", undefined)}>
                      <button className="text-accent-600 hover:underline">Tayangkan lagi</button>
                    </form>
                  ) : (
                    <form action={verifikasiTugasAkhir.bind(null, ta.id, "ditolak", "Ditarik oleh admin")}>
                      <button className="text-red-600 hover:underline">Takedown</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {(daftarTA ?? []).length === 0 && (
              <tr><td colSpan={5} className="p-3 text-slate-500">Belum ada TA.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}