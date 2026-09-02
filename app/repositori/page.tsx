import { createClient } from "@/lib/supabase/server";
import { TACard } from "@/components/ta-card";

export default async function RepositoriPage({
  searchParams,
}: {
  searchParams: { q?: string; prodi?: string; kategori?: string; tahun?: string; pembimbing?: string; penguji?: string; sdg?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("tugas_akhir")
    .select(`
      id, judul, tahun, prodi, created_at, sdgs,
      kategori_topik(nama_kategori),
      mahasiswa:profiles!tugas_akhir_mahasiswa_id_fkey(nama_lengkap, nim),
      pembimbing1:profiles!tugas_akhir_dosen_pembimbing_id_fkey(nama_lengkap),
      pembimbing2:profiles!tugas_akhir_dosen_pembimbing_2_id_fkey(nama_lengkap),
      penguji1:profiles!tugas_akhir_dosen_penguji_1_id_fkey(nama_lengkap),
      penguji2:profiles!tugas_akhir_dosen_penguji_2_id_fkey(nama_lengkap)
    `)
    .eq("status_verifikasi", "diterima")
    .order("created_at", { ascending: false });

  // Eksekusi Parameter Filter
  if (searchParams.q) query = query.textSearch("search_vector", searchParams.q);
  if (searchParams.prodi) query = query.eq("prodi", searchParams.prodi);
  if (searchParams.kategori) query = query.eq("kategori_id", searchParams.kategori);
  if (searchParams.tahun) query = query.eq("tahun", Number(searchParams.tahun));
  if (searchParams.pembimbing) {
    query = query.or(`dosen_pembimbing_id.eq.${searchParams.pembimbing},dosen_pembimbing_2_id.eq.${searchParams.pembimbing}`);
  }
  if (searchParams.penguji) {
    query = query.or(`dosen_penguji_1_id.eq.${searchParams.penguji},dosen_penguji_2_id.eq.${searchParams.penguji}`);
  }
  if (searchParams.sdg) query = query.contains("sdgs", [Number(searchParams.sdg)]);

  // Ambil data TA, daftar Kategori, dan daftar Dosen secara paralel
  const [{ data: daftarTA }, { data: kategoriList }, { data: dosenList }] = await Promise.all([
    query,
    supabase.from("kategori_topik").select("id, nama_kategori"),
    supabase.from("profiles").select("id, nama_lengkap").eq("role", "dosen").order("nama_lengkap"),
  ]);

  // Generasi opsi tahun dinamis (dari 2020 hingga tahun ini)
  const currentYear = new Date().getFullYear();
  const tahunList = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-primary-800">Jelajahi Repositori TA</h1>
      <p className="text-sm text-slate-500">Temukan dan unduh Tugas Akhir dari seluruh angkatan mahasiswa Teknik Otomotif UNP.</p>

      <form method="GET" className="mt-6 flex flex-col gap-6 sm:flex-row">
        {/* SIDEBAR FILTER */}
        <aside className="h-fit w-full shrink-0 space-y-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:w-[280px]">
          
          {/* PROGRAM STUDI */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Program Studi</p>
            <div className="space-y-2.5 text-sm text-slate-600">
              <label className="flex cursor-pointer items-center gap-2 hover:text-primary-700">
                <input type="radio" name="prodi" value="" defaultChecked={!searchParams.prodi} className="text-primary-600 focus:ring-primary-500" />
                Semua
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-primary-700">
                <input type="radio" name="prodi" value="s1_pend_otomotif" defaultChecked={searchParams.prodi === "s1_pend_otomotif"} className="text-primary-600 focus:ring-primary-500" />
                S1 Pend. Teknik Otomotif
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-primary-700">
                <input type="radio" name="prodi" value="d3_otomotif" defaultChecked={searchParams.prodi === "d3_otomotif"} className="text-primary-600 focus:ring-primary-500" />
                D3 Teknik Otomotif
              </label>
            </div>
          </div>

          {/* TAHUN */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tahun</p>
            <select name="tahun" defaultValue={searchParams.tahun ?? ""} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="">Semua tahun</option>
              {tahunList.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* KATEGORI */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Kategori / Topik</p>
            <select name="kategori" defaultValue={searchParams.kategori ?? ""} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="">Semua kategori</option>
              {(kategoriList ?? []).map((k) => (
                <option key={k.id} value={k.id}>{k.nama_kategori}</option>
              ))}
            </select>
          </div>

          {/* DOSEN PEMBIMBING */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Dosen Pembimbing</p>
            <select name="pembimbing" defaultValue={searchParams.pembimbing ?? ""} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="">Semua dosen pembimbing</option>
              {(dosenList ?? []).map((d) => (
                <option key={d.id} value={d.id}>{d.nama_lengkap}</option>
              ))}
            </select>
          </div>

          {/* DOSEN PENGUJI */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Dosen Penguji</p>
            <select name="penguji" defaultValue={searchParams.penguji ?? ""} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="">Semua dosen penguji</option>
              {(dosenList ?? []).map((d) => (
                <option key={d.id} value={d.id}>{d.nama_lengkap}</option>
              ))}
            </select>
          </div>

          {/* TAG SDGS (Grid Checkbox Visual) */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tag SDGs</p>
            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer">
                <input type="radio" name="sdg" value="" defaultChecked={!searchParams.sdg} className="peer hidden" />
                <span className="flex h-8 items-center rounded-lg bg-slate-100 px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-200 peer-checked:bg-primary-600 peer-checked:text-white">
                  Semua
                </span>
              </label>
              {Array.from({ length: 17 }, (_, i) => i + 1).map((num) => (
                <label key={num} className="cursor-pointer">
                  <input type="radio" name="sdg" value={num} defaultChecked={searchParams.sdg === String(num)} className="peer hidden" />
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-200 peer-checked:bg-primary-600 peer-checked:text-white">
                    {num}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="mt-2 w-full rounded-lg bg-primary-100 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-200">
            Terapkan Filter
          </button>
        </aside>

        {/* KONTEN UTAMA */}
        <div className="flex-1">
          <div className="mb-6 flex overflow-hidden rounded-full border border-slate-200 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <input name="q" defaultValue={searchParams.q} placeholder="Cari judul, penulis, kata kunci..." className="flex-1 px-5 py-3.5 text-sm text-slate-700 focus:outline-none" />
            <button type="submit" className="bg-accent-500 px-8 font-semibold text-white transition-colors hover:bg-accent-600">Cari</button>
          </div>

          <p className="mb-4 text-sm text-slate-500">{(daftarTA ?? []).length} TA ditemukan</p>
          
          <div className="grid gap-5 sm:grid-cols-2">
            {(daftarTA ?? []).map((ta: any) => (
              <TACard key={ta.id} ta={ta} />
            ))}
            {(daftarTA ?? []).length === 0 && (
              <div className="col-span-2 rounded-2xl border border-slate-100 bg-white py-12 text-center text-sm text-slate-500 shadow-sm">
                Belum ada TA yang cocok dengan filter.
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}