import { createClient } from "@/lib/supabase/server";
import { TACard } from "@/components/ta-card";
import { FilterSelect } from "./filter-select";
import { DAFTAR_SDGS } from "@/lib/sdgs";
import { SEMUA_KBK, LABEL_JENIS_DOC, LABEL_BIDANG } from "@/lib/klasifikasi";

type SP = Record<string, string | undefined>;

function hrefFor(searchParams: SP, changes: SP) {
  const merged = { ...searchParams, ...changes };
  const params = new URLSearchParams();
  Object.entries(merged).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  const qs = params.toString();
  return qs ? `/repositori?${qs}` : "/repositori";
}

export default async function RepositoriPage({
  searchParams,
}: {
  searchParams: { q?: string; prodi?: string; kategori?: string; tahun?: string; pembimbing?: string; penguji?: string; sdg?: string; kbk?: string; jenis?: string; bidang?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("tugas_akhir")
    .select(`
      id, judul, tahun, prodi, sdgs, kbk, jenis_doc, bidang,
      kategori_topik(nama_kategori),
      mahasiswa:profiles!tugas_akhir_mahasiswa_id_fkey(nama_lengkap, nim),
      pembimbing1:profiles!tugas_akhir_dosen_pembimbing_id_fkey(nama_lengkap),
      pembimbing2:profiles!tugas_akhir_dosen_pembimbing_2_id_fkey(nama_lengkap),
      penguji1:profiles!tugas_akhir_dosen_penguji_1_id_fkey(nama_lengkap),
      penguji2:profiles!tugas_akhir_dosen_penguji_2_id_fkey(nama_lengkap),
      penguji3:profiles!tugas_akhir_dosen_penguji_3_id_fkey(nama_lengkap)
    `)
    .eq("status_verifikasi", "diterima")
    .order("created_at", { ascending: false });

  if (searchParams.q) query = query.textSearch("search_vector", searchParams.q);
  if (searchParams.prodi) query = query.eq("prodi", searchParams.prodi);
  if (searchParams.kategori) query = query.eq("kategori_id", searchParams.kategori);
  if (searchParams.tahun) query = query.eq("tahun", Number(searchParams.tahun));
  if (searchParams.kbk) query = query.eq("kbk", searchParams.kbk);
  if (searchParams.jenis) query = query.eq("jenis_doc", searchParams.jenis);
  if (searchParams.bidang) query = query.eq("bidang", searchParams.bidang);
  if (searchParams.pembimbing) {
    query = query.or(`dosen_pembimbing_id.eq.${searchParams.pembimbing},dosen_pembimbing_2_id.eq.${searchParams.pembimbing}`);
  }
  if (searchParams.penguji) {
    query = query.or(`dosen_penguji_1_id.eq.${searchParams.penguji},dosen_penguji_2_id.eq.${searchParams.penguji},dosen_penguji_3_id.eq.${searchParams.penguji}`);
  }
  if (searchParams.sdg) query = query.contains("sdgs", [Number(searchParams.sdg)]);

  const { data: daftarTA } = await query;

  const [{ data: kategoriList }, { data: dosenList }, { data: tahunRows }] = await Promise.all([
    supabase.from("kategori_topik").select("id, nama_kategori").order("nama_kategori"),
    supabase.from("profiles").select("id, nama_lengkap").eq("role", "dosen").order("nama_lengkap"),
    supabase.from("tugas_akhir").select("tahun").eq("status_verifikasi", "diterima"),
  ]);

  const tahunOptions = Array.from(new Set((tahunRows ?? []).map((r) => r.tahun))).sort((a, b) => b - a);
  const linkClass = (active: boolean) =>
    `block py-0.5 ${active ? "font-medium text-accent-600" : "text-slate-600 hover:text-accent-600"}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-primary-800">Jelajahi Repositori TA</h1>
      <p className="text-sm text-slate-500">Temukan dan unduh Tugas Akhir dari seluruh angkatan mahasiswa Teknik Otomotif UNP.</p>

      <form className="mt-4 flex overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
        <input name="q" defaultValue={searchParams.q} placeholder="Cari judul, penulis, kata kunci..." className="flex-1 px-4 py-2.5 focus:outline-none" />
        <button className="bg-accent-500 px-5 font-medium text-white hover:bg-accent-600">Cari</button>
      </form>

      <div className="mt-6 grid gap-6 sm:grid-cols-[240px_1fr]">
        <aside className="h-fit space-y-4 rounded-2xl border border-slate-100 bg-white p-4 text-sm shadow-sm">
          <div>
            <p className="mb-1 font-medium text-primary-800">Program Studi</p>
            <a href={hrefFor(searchParams, { prodi: undefined })} className={linkClass(!searchParams.prodi)}>Semua</a>
            <a href={hrefFor(searchParams, { prodi: "s1_pend_otomotif" })} className={linkClass(searchParams.prodi === "s1_pend_otomotif")}>S1 Pend. Teknik Otomotif</a>
            <a href={hrefFor(searchParams, { prodi: "d3_otomotif" })} className={linkClass(searchParams.prodi === "d3_otomotif")}>D3 Teknik Otomotif</a>
          </div>

          <FilterSelect name="tahun" label="Tahun" placeholder="Semua tahun" options={tahunOptions.map((t) => ({ value: String(t), label: String(t) }))} />
          <FilterSelect name="kategori" label="Kategori / Topik" placeholder="Semua kategori" options={(kategoriList ?? []).map((k) => ({ value: k.id, label: k.nama_kategori }))} />
          <FilterSelect name="kbk" label="KBK" placeholder="Semua KBK" options={SEMUA_KBK.map((k) => ({ value: k, label: k }))} />
          <FilterSelect name="jenis" label="Jenis Dokumen" placeholder="Semua jenis" options={Object.entries(LABEL_JENIS_DOC).map(([value, label]) => ({ value, label }))} />
          <FilterSelect name="bidang" label="Bidang" placeholder="Semua bidang" options={Object.entries(LABEL_BIDANG).map(([value, label]) => ({ value, label }))} />
          <FilterSelect name="pembimbing" label="Dosen Pembimbing" placeholder="Semua dosen pembimbing" options={(dosenList ?? []).map((d) => ({ value: d.id, label: d.nama_lengkap }))} />
          <FilterSelect name="penguji" label="Dosen Penguji" placeholder="Semua dosen penguji" options={(dosenList ?? []).map((d) => ({ value: d.id, label: d.nama_lengkap }))} />

          <div>
            <p className="mb-1 font-medium text-primary-800">Tag SDGs</p>
            <div className="flex flex-wrap gap-1">
              {DAFTAR_SDGS.map((s) => {
                const active = searchParams.sdg === String(s.nomor);
                return (
                  <a
                    key={s.nomor}
                    href={hrefFor(searchParams, { sdg: active ? undefined : String(s.nomor) })}
                    style={active ? { backgroundColor: s.warna } : undefined}
                    className={`rounded px-1.5 py-0.5 text-xs font-medium ${active ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    title={s.nama}
                  >
                    {s.nomor}
                  </a>
                );
              })}
            </div>
          </div>
        </aside>

        <div>
          <p className="mb-3 text-sm text-slate-500">{(daftarTA ?? []).length} TA ditemukan</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(daftarTA ?? []).map((ta: any) => (
              <TACard key={ta.id} ta={ta} />
            ))}
            {(daftarTA ?? []).length === 0 && <p className="text-sm text-slate-500">Belum ada TA yang cocok.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}