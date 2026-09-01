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

      <form className="mt-4 flex overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
        <input name="q" defaultValue={searchParams.q} placeholder="Cari judul, penulis, kata kunci..." className="flex-1 px-4 py-2.5 focus:outline-none" />
        <button className="bg-accent-500 px-5 font-medium text-white hover:bg-accent-600">Cari</button>
      </form>

      <div className="mt-6 grid gap-6 sm:grid-cols-[220px_1fr]">
        <aside className="h-fit space-y-4 rounded-2xl border border-slate-100 bg-white p-4 text-sm shadow-sm">
          <div>
            <p className="mb-1 font-medium text-primary-800">Program Studi</p>
            <a href="/repositori" className="block py-0.5 text-slate-600 hover:text-accent-600">Semua</a>
            <a href="/repositori?prodi=s1_pend_otomotif" className="block py-0.5 text-slate-600 hover:text-accent-600">S1 Pend. Teknik Otomotif</a>
            <a href="/repositori?prodi=d3_otomotif" className="block py-0.5 text-slate-600 hover:text-accent-600">D3 Teknik Otomotif</a>
          </div>
          <div>
            <p className="mb-1 font-medium text-primary-800">Kategori / Topik</p>
            <a href="/repositori" className="block py-0.5 text-slate-600 hover:text-accent-600">Semua kategori</a>
            {(kategoriList ?? []).map((k) => (
              <a key={k.id} href={`/repositori?kategori=${k.id}`} className="block py-0.5 text-slate-600 hover:text-accent-600">{k.nama_kategori}</a>
            ))}
          </div>
        </aside>

        <div>
          <p className="mb-3 text-sm text-slate-500">{(daftarTA ?? []).length} TA ditemukan</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(daftarTA ?? []).map((ta: any) => (
              <a key={ta.id} href={`/ta/${ta.id}`} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className={`mr-1 rounded px-1.5 py-0.5 text-xs font-medium ${ta.prodi === "s1_pend_otomotif" ? "bg-primary-100 text-primary-700" : "bg-accent-100 text-accent-700"}`}>
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