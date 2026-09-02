import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { TACard } from "@/components/ta-card";
import { Flame, Zap, Cog, Truck, BatteryCharging, Wrench, Fuel, Snowflake } from "lucide-react";

const KATEGORI_META: Record<string, { icon: React.ElementType; warna: string }> = {
  "Motor Bakar": { icon: Flame, warna: "#EF4444" },
  "Kelistrikan Otomotif": { icon: Zap, warna: "#EAB308" },
  "Sasis & Pemindah Tenaga": { icon: Cog, warna: "#6B7280" },
  "Alat Berat": { icon: Truck, warna: "#92400E" },
  "Kendaraan Listrik (EV)": { icon: BatteryCharging, warna: "#16A34A" },
  "Manajemen Bengkel & Pendidikan": { icon: Wrench, warna: "#2563EB" },
  "Sistem Bahan Bakar": { icon: Fuel, warna: "#C2410C" },
  "Sistem Pendinginan": { icon: Snowflake, warna: "#0EA5E9" },
};

export default async function BerandaPage() {
  const supabase = createClient();
  const tahunIni = new Date().getFullYear();

  const [
    { count: totalTA },
    { count: taTahunIni },
    { data: pembimbingRows },
    { data: sdgRows },
    { count: totalS1 },
    { count: totalD3 },
    { data: kategoriRows },
    { data: terbaru },
  ] = await Promise.all([
    supabase.from("tugas_akhir").select("*", { count: "exact", head: true }).eq("status_verifikasi", "diterima"),
    supabase.from("tugas_akhir").select("*", { count: "exact", head: true }).eq("status_verifikasi", "diterima").eq("tahun", tahunIni),
    supabase.from("tugas_akhir").select("dosen_pembimbing_id, dosen_pembimbing_2_id").eq("status_verifikasi", "diterima"),
    supabase.from("tugas_akhir").select("sdgs").eq("status_verifikasi", "diterima"),
    supabase.from("tugas_akhir").select("*", { count: "exact", head: true }).eq("status_verifikasi", "diterima").eq("prodi", "s1_pend_otomotif"),
    supabase.from("tugas_akhir").select("*", { count: "exact", head: true }).eq("status_verifikasi", "diterima").eq("prodi", "d3_otomotif"),
    supabase.from("kategori_topik").select("id, nama_kategori"),
    supabase
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
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const dosenAktif = new Set(
    (pembimbingRows ?? []).flatMap((r) => [r.dosen_pembimbing_id, r.dosen_pembimbing_2_id]).filter(Boolean)
  ).size;
  const taSdgs = (sdgRows ?? []).filter((r) => (r.sdgs?.length ?? 0) > 0).length;

  return (
    <div>
      <section className="bg-gradient-to-b from-primary-900 to-primary-700 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs">Fakultas Teknik · Universitas Negeri Padang</span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Repository Tugas Akhir <span className="text-accent-400">Teknik Otomotif UNP</span>
          </h1>
          <p className="mt-3 text-primary-200">
            Platform digital terpusat untuk menemukan, menyimpan, dan mengeksplorasi seluruh karya ilmiah
            mahasiswa S1 Pendidikan Teknik Otomotif dan D3 Teknik Otomotif.
          </p>
          <form action="/repositori" method="GET" className="mt-6 flex overflow-hidden rounded-full shadow-lg">
            <input
              name="q"
              placeholder="Cari judul, penulis, kata kunci, atau topik TA..."
              className="flex-1 px-5 py-3 text-slate-800 focus:outline-none"
            />
            <button className="bg-accent-500 px-6 font-medium hover:bg-accent-600">Cari TA</button>
          </form>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-6xl px-4">
        <div className="grid gap-4 rounded-2xl bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:grid-cols-4">
          <Stat label="Total TA Tersimpan" value={totalTA ?? 0} />
          <Stat label={`TA Tahun ${tahunIni}`} value={taTahunIni ?? 0} />
          <Stat label="Dosen Pembimbing Aktif" value={dosenAktif} />
          <Stat label="TA Berkontribusi SDGs" value={taSdgs} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-lg font-heading font-semibold text-primary-800">Jelajahi Berdasarkan Program Studi</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ProdiCard label="S1 Pendidikan Teknik Otomotif" desc="Skripsi pendidikan kejuruan, pengembangan media pembelajaran, penelitian pedagogik otomotif" jumlah={totalS1 ?? 0} href="/repositori?prodi=s1_pend_otomotif" />
          <ProdiCard label="D3 Teknik Otomotif" desc="Laporan Tugas Akhir vokasional, rancang bangun, analisis teknis, diagnosis kendaraan" jumlah={totalD3 ?? 0} href="/repositori?prodi=d3_otomotif" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="mb-4 text-lg font-heading font-semibold text-primary-800">Jelajahi Berdasarkan Kategori</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          {(kategoriRows ?? []).map((k) => {
            const meta = KATEGORI_META[k.nama_kategori];
            const Icon = meta?.icon ?? Cog;
            return (
              <Link
                key={k.id}
                href={`/repositori?kategori=${k.id}`}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)]"
              >
                <Icon className="h-5 w-5" style={{ color: meta?.warna ?? "#64748B" }} strokeWidth={1.75} />
                <p className="mt-2 text-sm font-medium text-primary-800">{k.nama_kategori}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-primary-800">Tugas Akhir Terbaru</h2>
          <Link href="/repositori" className="text-sm text-accent-600 hover:underline">Lihat semua →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {(terbaru ?? []).map((ta: any) => (
            <TACard key={ta.id} ta={ta} />
          ))}
          {(terbaru ?? []).length === 0 && <p className="text-sm text-slate-500">Belum ada TA yang terbit.</p>}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-2xl font-heading font-bold text-primary-800">{value.toLocaleString("id-ID")}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function ProdiCard({ label, desc, jumlah, href }: { label: string; desc: string; jumlah: number; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)]">
      <p className="font-heading font-semibold text-primary-800">{label}</p>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
      <p className="mt-3 text-2xl font-heading font-bold text-accent-500">{jumlah}</p>
      <p className="text-xs text-slate-500">koleksi TA tersedia</p>
    </Link>
  );
}