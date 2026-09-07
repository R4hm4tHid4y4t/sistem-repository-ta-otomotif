import { createClient } from "@/lib/supabase/server";
import { verifikasiTugasAkhir } from "@/lib/actions/ta";
import { LABEL_JENIS_DOC, LABEL_BIDANG, type JenisDoc, type Bidang } from "@/lib/klasifikasi";

export default async function KelolaTAPage() {
  const supabase = createClient();
  const { data: daftarTA } = await supabase
    .from("tugas_akhir")
    .select(`
      id, judul, tahun, status_verifikasi, kbk, jenis_doc, bidang,
      mahasiswa:profiles!tugas_akhir_mahasiswa_id_fkey(nama_lengkap),
      pembimbing1:profiles!tugas_akhir_dosen_pembimbing_id_fkey(nama_lengkap),
      pembimbing2:profiles!tugas_akhir_dosen_pembimbing_2_id_fkey(nama_lengkap),
      penguji1:profiles!tugas_akhir_dosen_penguji_1_id_fkey(nama_lengkap),
      penguji2:profiles!tugas_akhir_dosen_penguji_2_id_fkey(nama_lengkap),
      penguji3:profiles!tugas_akhir_dosen_penguji_3_id_fkey(nama_lengkap)
    `)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-primary-800">Kelola TA</h1>
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Judul</th>
              <th className="p-3">Penulis</th>
              <th className="p-3">Jenis</th>
              <th className="p-3">KBK</th>
              <th className="p-3">Bidang</th>
              <th className="p-3">Pembimbing I & II</th>
              <th className="p-3">Penguji I/II/III</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(daftarTA ?? []).map((ta: any) => {
              const pembimbing = [ta.pembimbing1?.nama_lengkap, ta.pembimbing2?.nama_lengkap].filter(Boolean).join(", ") || "-";
              const penguji = [ta.penguji1?.nama_lengkap, ta.penguji2?.nama_lengkap, ta.penguji3?.nama_lengkap].filter(Boolean).join(", ") || "-";
              return (
                <tr key={ta.id} className="border-t border-slate-100 align-top">
                  <td className="p-3 font-medium text-primary-800">
                    <a href={`/ta/${ta.id}`} className="hover:underline">{ta.judul}</a>
                    <p className="text-xs font-normal text-slate-400">{ta.tahun}</p>
                  </td>
                  <td className="p-3">{ta.mahasiswa?.nama_lengkap}</td>
                  <td className="p-3">{LABEL_JENIS_DOC[ta.jenis_doc as JenisDoc]}</td>
                  <td className="p-3">{ta.kbk ?? "-"}</td>
                  <td className="p-3">{ta.bidang ? LABEL_BIDANG[ta.bidang as Bidang] : "-"}</td>
                  <td className="p-3">{pembimbing}</td>
                  <td className="p-3">{penguji}</td>
                  <td className="p-3">
                    {ta.status_verifikasi === "ditolak" ? (
                      <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">Ditarik</span>
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
                        <button className="font-medium text-red-600 hover:underline">Takedown</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
            {(daftarTA ?? []).length === 0 && (
              <tr><td colSpan={9} className="p-3 text-slate-500">Belum ada TA.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}