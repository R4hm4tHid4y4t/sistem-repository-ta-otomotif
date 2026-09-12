import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getDaftarSdgs, cariSdg } from "@/lib/sdgs";
import { LABEL_JENIS_DOC, LABEL_BIDANG, type JenisDoc, type Bidang } from "@/lib/klasifikasi";
import { DownloadTAButton } from "./download-button";

export default async function DetailTAPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  let profile: { role: string } | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    profile = data;
  }
  const bolehUnduh = profile?.role === "mahasiswa" || profile?.role === "dosen" || profile?.role === "admin";

  const { data: ta } = await supabase
    .from("tugas_akhir")
    .select(`
      *,
      kategori_topik(nama_kategori),
      mahasiswa:profiles!tugas_akhir_mahasiswa_id_fkey(nama_lengkap, nim),
      pembimbing1:profiles!tugas_akhir_dosen_pembimbing_id_fkey(nama_lengkap),
      pembimbing2:profiles!tugas_akhir_dosen_pembimbing_2_id_fkey(nama_lengkap),
      penguji1:profiles!tugas_akhir_dosen_penguji_1_id_fkey(nama_lengkap),
      penguji2:profiles!tugas_akhir_dosen_penguji_2_id_fkey(nama_lengkap),
      penguji3:profiles!tugas_akhir_dosen_penguji_3_id_fkey(nama_lengkap)
    `)
    .eq("id", params.id)
    .eq("status_verifikasi", "diterima")
    .single();

  if (!ta) return notFound();

  const [{ data: terkait }, sdgsList] = await Promise.all([
    supabase
      .from("tugas_akhir")
      .select("id, judul, tahun, mahasiswa:profiles!tugas_akhir_mahasiswa_id_fkey(nama_lengkap)")
      .eq("status_verifikasi", "diterima")
      .eq("kategori_id", ta.kategori_id)
      .neq("id", ta.id)
      .limit(2),
    getDaftarSdgs(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="mb-4 text-xs text-slate-500">
        <a href="/">Beranda</a> / <a href="/repositori">Repositori</a> / {ta.judul.slice(0, 40)}...
      </p>

      <div className="grid gap-6 sm:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <span className={`rounded px-2 py-1 text-xs font-medium ${ta.prodi === "s1_pend_otomotif" ? "bg-primary-100 text-primary-700" : "bg-accent-100 text-accent-700"}`}>
              {ta.prodi === "s1_pend_otomotif" ? "S1" : "D3"}
            </span>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
              {ta.kategori_topik?.nama_kategori ?? "Umum"}
            </span>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
              {LABEL_JENIS_DOC[ta.jenis_doc as JenisDoc]}
            </span>
            {ta.kbk && (
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{ta.kbk}</span>
            )}
            {ta.bidang && (
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{LABEL_BIDANG[ta.bidang as Bidang]}</span>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-primary-800">{ta.judul}</h1>

          <div className="mt-4 grid gap-3 rounded-2xl border border-slate-100 bg-white p-5 text-sm shadow-sm sm:grid-cols-3">
            <Info label="Penulis" value={ta.mahasiswa?.nama_lengkap} />
            <Info label="NIM" value={ta.mahasiswa?.nim} />
            <Info label="Tahun Lulus" value={String(ta.tahun)} />
            <Info label="Pembimbing I" value={ta.pembimbing1?.nama_lengkap ?? "-"} />
            <Info label="Pembimbing II" value={ta.pembimbing2?.nama_lengkap ?? "-"} />
            <Info label="Penguji I" value={ta.penguji1?.nama_lengkap ?? "-"} />
            <Info label="Penguji II" value={ta.penguji2?.nama_lengkap ?? "-"} />
            {ta.penguji3?.nama_lengkap && <Info label="Penguji III" value={ta.penguji3.nama_lengkap} />}
            <Info
              label="Diunggah"
              value={new Date(ta.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            />
          </div>

          {ta.sdgs?.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-primary-800">Kontribusi terhadap SDGs</p>
              <div className="flex flex-wrap gap-2">
                {ta.sdgs.map((n: number) => {
                  const sdg = cariSdg(sdgsList, n);
                  if (!sdg) return null;
                  return (
                    <span key={n} style={{ backgroundColor: sdg.warna }} className="rounded px-2 py-1 text-xs font-medium text-white">
                      {sdg.nomor} {sdg.nama}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="mb-2 font-medium text-primary-800">Abstrak</p>
            <p className="text-sm leading-relaxed text-slate-700">{ta.abstrak}</p>
          </div>

          {ta.kata_kunci?.length > 0 && (
            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="mb-2 font-medium text-primary-800">Kata Kunci</p>
              <div className="flex flex-wrap gap-2">
                {ta.kata_kunci.map((k: string) => (
                  <span key={k} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{k}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-medium text-primary-800">Pratinjau Dokumen</p>
              {bolehUnduh && <DownloadTAButton taId={ta.id} label="Unduh PDF" />}
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">
              <span className="text-3xl">📄</span>
              <p className="mt-2">
                {bolehUnduh ? 'Klik "Unduh PDF" untuk membuka dokumen' : "Pratinjau memerlukan akun mahasiswa/dosen"}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-medium text-primary-800">Aksi</p>
            {bolehUnduh ? (
              <DownloadTAButton taId={ta.id} />
            ) : (
              <>
                <p className="mb-3 text-xs text-slate-500">Login sebagai mahasiswa atau dosen untuk mengunduh dokumen.</p>
                <a href="/login" className="block rounded-lg border border-primary-600 px-4 py-2 text-center text-sm font-medium text-primary-700 hover:bg-primary-50">Masuk</a>
              </>
            )}
          </div>

          {(terkait ?? []).length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="mb-2 text-sm font-medium text-primary-800">TA Terkait</p>
              <ul className="space-y-2 text-sm">
                {(terkait ?? []).map((t: any) => (
                  <li key={t.id}>
                    <a href={`/ta/${t.id}`} className="font-medium text-primary-700 hover:underline">{t.judul}</a>
                    <p className="text-xs text-slate-500">{t.mahasiswa?.nama_lengkap} · {t.tahun}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-700">{value ?? "-"}</p>
    </div>
  );
}