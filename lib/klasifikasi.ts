export type Prodi = "s1_pend_otomotif" | "d3_otomotif";
export type JenisDoc = "ta" | "jurnal" | "laporan_pkl" | "laporan_praktek_industri";
export type Bidang = "kependidikan" | "non_kependidikan";

export const LABEL_JENIS_DOC: Record<JenisDoc, string> = {
  ta: "Tugas Akhir",
  jurnal: "Jurnal",
  laporan_pkl: "Laporan PKL",
  laporan_praktek_industri: "Laporan Praktek Industri",
};

export const JENIS_DOC_PER_PRODI: Record<Prodi, JenisDoc[]> = {
  s1_pend_otomotif: ["ta", "jurnal", "laporan_pkl", "laporan_praktek_industri"],
  d3_otomotif: ["ta", "laporan_praktek_industri"],
};

export const KBK_PER_PRODI: Record<Prodi, string[]> = {
  s1_pend_otomotif: [
    "Mesin Konversi Energi",
    "Kelistrikan Kendaraan",
    "Pendidikan Teknik Otomotif",
    "Kendaraan Ringan",
    "Alat Berat",
  ],
  d3_otomotif: ["Mesin Otomotif", "Kelistrikan Otomotif", "Alat Berat"],
};

export const SEMUA_KBK = Array.from(
  new Set([...KBK_PER_PRODI.s1_pend_otomotif, ...KBK_PER_PRODI.d3_otomotif])
);

export const LABEL_BIDANG: Record<Bidang, string> = {
  kependidikan: "Kependidikan",
  non_kependidikan: "Non-Kependidikan",
};