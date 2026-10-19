import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LABEL_JENIS_DOC, type JenisDoc } from "@/lib/klasifikasi";

export default async function KaryaSayaPage({
  searchParams,
}: {
  searchParams: { uploaded?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: daftarKarya } = await supabase
    .from("tugas_akhir")
    .select("id, judul, tahun, status_verifikasi, jenis_doc")
    .eq("mahasiswa_id", user?.id)
    .order("created_at", { ascending: false });

  const rows = daftarKarya ?? [];
  const aktif = rows.filter((k) => k.status_verifikasi !== "ditolak");
  const adaPlk = aktif.some((k) => k.jenis_doc === "laporan_pkl");
  const adaPtk = aktif.some((k) => k.jenis_doc === "laporan_ptk");
  const laporanKurang = adaPlk && !adaPtk ? "Laporan PTK" : adaPtk && !adaPlk ? "Laporan PLK" : null;

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-primary-800">Karya Saya</h1>
      {searchParams.uploaded && (
        <p className="mb-4 rounded bg-primary-50 p-3 text-sm text-primary-700">
          Karya berhasil diunggah dan langsung tayang di repositori.
        </p>
      )}
      {laporanKurang && (
        <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Laporan PLK dan Laporan PTK sama-sama wajib. Kamu belum mengunggah <strong>{laporanKurang}</strong>.{" "}
          <Link href="/dashboard/mahasiswa/upload" className="font-medium underline">Unggah sekarang</Link>
        </p>
      )}
      <ul className="space-y-2">
        {rows.map((karya) => (
          <li key={karya.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div>
              <Link href={`/ta/${karya.id}`} className="font-medium text-primary-700 hover:underline">{karya.judul}</Link>
              <p className="text-sm text-slate-500">
                {LABEL_JENIS_DOC[karya.jenis_doc as JenisDoc] ?? karya.jenis_doc} · {karya.tahun}
              </p>
            </div>
            {karya.status_verifikasi === "ditolak" ? (
              <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">Ditarik oleh admin</span>
            ) : (
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Tayang</span>
            )}
          </li>
        ))}
        {rows.length === 0 && <p className="text-slate-500">Kamu belum mengunggah karya.</p>}
      </ul>
    </div>
  );
}