import { createClient } from "@/lib/supabase/server";

export default async function RepositoriPage({
  searchParams,
}: {
  searchParams: { q?: string; prodi?: string; kategori?: string; tahun?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("tugas_akhir")
    .select("id, judul, tahun, prodi, kategori_topik(nama_kategori), mahasiswa:profiles!tugas_akhir_mahasiswa_id_fkey(nama_lengkap, nim)")
    .eq("status_verifikasi", "diterima")
    .order("created_at", { ascending: false });

  if (searchParams.q) query = query.textSearch("search_vector", searchParams.q);
  if (searchParams.prodi) query = query.eq("prodi", searchParams.prodi);
  if (searchParams.kategori) query = query.eq("kategori_id", searchParams.kategori);
  if (searchParams.tahun) query = query.eq("tahun", Number(searchParams.tahun));

  const { data: daftarTA } = await query;
  const { data: kategoriList } = await supabase.from("kategori_topik").select("id, nama_kategori");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-primary-800">Jelajahi Repositori TA</h1>
      <p className="text-sm text-slate-500">Temukan dan unduh Tugas Akhir dari seluruh angkatan mahasiswa Teknik Otomotif UNP.</p>

      <form className="mt-4 flex gap-2">
        <input name="q" defaultValue={searchParams.q} placeholder="Cari judul, penulis, kata kunci..." className="flex-1 rounded border border-slate-300 px-3 py-2" />
        <button className="rounded bg-accent-500 px-4 py-2 text-white">Cari</button>
      </form>

      <div className="mt-6 grid gap-6 sm:grid-cols-[220px_1fr]">
        <aside className="space-y-4 text-sm">
          <div>
            <p className="mb-1 font-medium text-primary-800">Program Studi</p>
            <a href="/repositori" className="block py-0.5">Semua</a>
            <a href="/repositori?prodi=s1_pend_otomotif" className="block py-0.5">S1 Pend. Teknik Otomotif</a>
            <a href="/repositori?prodi=d3_otomotif" className="block py-0.5">D3 Teknik Otomotif</a>
          </div>
          <div>
            <p className="mb-1 font-medium text-primary-800">Kategori / Topik</p>
            <a href="/repositori" className="block py-0.5">Semua kategori</a>
            {(kategoriList ?? []).map((k) => (
              <a key={k.id} href={`/repositori?kategori=${k.id}`} className="block py-0.5">{k.nama_kategori}</a>
            ))}
          </div>
        </aside>

        <div>
          <p className="mb-3 text-sm text-slate-500">{(daftarTA ?? []).length} TA ditemukan</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(daftarTA ?? []).map((ta: any) => (
              <a key={ta.id} href={`/ta/${ta.id}`} className="rounded-lg border border-slate-200 p-4 hover:border-accent-400">
                <span className="mr-1 rounded bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-700">
                  {ta.prodi === "s1_pend_otomotif" ? "S1" : "D3"}
                </span>
                <span className="text-xs text-slate-500">{ta.kategori_topik?.nama_kategori ?? "Umum"}</span>
                <p className="mt-1 font-medium text-primary-800">{ta.judul}</p>
                <p className="mt-1 text-xs text-slate-500">{ta.mahasiswa?.nama_lengkap} · {ta.mahasiswa?.nim}</p>
              </a>
            ))}
            {(daftarTA ?? []).length === 0 && <p className="text-sm text-slate-500">Belum ada TA yang cocok.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}