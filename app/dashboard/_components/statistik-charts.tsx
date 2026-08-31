import { createClient } from "@/lib/supabase/server";
import { StatistikChartsClient } from "./statistik-charts-client";

export async function StatistikCharts({ lengkap = false }: { lengkap?: boolean }) {
  const supabase = createClient();

  const [{ data: taRows }, { data: dosenRows }, { data: kategoriRows }] = await Promise.all([
    supabase
      .from("tugas_akhir")
      .select("tahun, prodi, kategori_id, sdgs, dosen_pembimbing_id, dosen_pembimbing_2_id, dosen_penguji_1_id, dosen_penguji_2_id")
      .eq("status_verifikasi", "diterima"),
    supabase.from("profiles").select("id, nama_lengkap").eq("role", "dosen"),
    supabase.from("kategori_topik").select("id, nama_kategori"),
  ]);

  const rows = taRows ?? [];
  const dosenMap = new Map((dosenRows ?? []).map((d) => [d.id, d.nama_lengkap]));
  const kategoriMap = new Map((kategoriRows ?? []).map((k) => [k.id, k.nama_kategori]));

  const tahunSet = Array.from(new Set(rows.map((r) => r.tahun))).sort();
  const perTahun = tahunSet.map((tahun) => ({
    tahun: String(tahun),
    S1: rows.filter((r) => r.tahun === tahun && r.prodi === "s1_pend_otomotif").length,
    D3: rows.filter((r) => r.tahun === tahun && r.prodi === "d3_otomotif").length,
  }));

  const kategoriCount = new Map<string, number>();
  rows.forEach((r) => {
    const nama = r.kategori_id ? kategoriMap.get(r.kategori_id) ?? "Lainnya" : "Lainnya";
    kategoriCount.set(nama, (kategoriCount.get(nama) ?? 0) + 1);
  });
  const perKategori = Array.from(kategoriCount, ([nama, jumlah]) => ({ nama, jumlah }));

  const pembimbingCount = new Map<string, number>();
  rows.forEach((r) => {
    [r.dosen_pembimbing_id, r.dosen_pembimbing_2_id].forEach((id) => {
      if (id) pembimbingCount.set(id, (pembimbingCount.get(id) ?? 0) + 1);
    });
  });
  const perPembimbing = Array.from(pembimbingCount, ([id, jumlah]) => ({
    nama: dosenMap.get(id) ?? "Tidak diketahui",
    jumlah,
  })).sort((a, b) => b.jumlah - a.jumlah);

  const pengujiCount = new Map<string, number>();
  rows.forEach((r) => {
    [r.dosen_penguji_1_id, r.dosen_penguji_2_id].forEach((id) => {
      if (id) pengujiCount.set(id, (pengujiCount.get(id) ?? 0) + 1);
    });
  });
  const perPenguji = Array.from(pengujiCount, ([id, jumlah]) => ({
    nama: dosenMap.get(id) ?? "Tidak diketahui",
    jumlah,
  })).sort((a, b) => b.jumlah - a.jumlah);

  const sdgCount: Record<number, number> = {};
  rows.forEach((r) => (r.sdgs ?? []).forEach((n: number) => (sdgCount[n] = (sdgCount[n] ?? 0) + 1)));

  return (
    <StatistikChartsClient
      lengkap={lengkap}
      totalTA={rows.length}
      perTahun={perTahun}
      perKategori={perKategori}
      perPembimbing={perPembimbing}
      perPenguji={perPenguji}
      sdgCount={sdgCount}
    />
  );
}