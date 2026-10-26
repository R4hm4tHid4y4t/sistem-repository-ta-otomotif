export type Prodi = "s1_pend_otomotif" | "d3_otomotif";
export type JenisDoc = "ta" | "jurnal" | "laporan_pkl" | "laporan_ptk" | "laporan_praktek_industri" | "prestasi";
export type Bidang = "kependidikan" | "non_kependidikan";

export const LABEL_JENIS_DOC: Record<JenisDoc, string> = {
  ta: "Tugas Akhir / Skripsi",
  jurnal: "Jurnal",
  laporan_pkl: "Laporan Praktik Lapangan Kependidikan (PLK)",
  laporan_ptk: "Laporan Penelitian Tindakan Kelas (PTK)",
  laporan_praktek_industri: "Laporan Praktik Lapangan Industri (PLI)",
  prestasi: "Prestasi",
};

export const JENIS_DOC_PER_PRODI: Record<Prodi, JenisDoc[]> = {
  s1_pend_otomotif: ["ta", "jurnal", "laporan_pkl", "laporan_ptk", "laporan_praktek_industri", "prestasi"],
  d3_otomotif: ["ta", "laporan_praktek_industri", "prestasi"],
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

export type KategoriPrestasi = "akademik" | "non_akademik";
export type TingkatPrestasi = "internasional" | "nasional" | "daerah";

export const LABEL_KATEGORI_PRESTASI: Record<KategoriPrestasi, string> = {
  akademik: "Akademik",
  non_akademik: "Non Akademik",
};

export const LABEL_TINGKAT_PRESTASI: Record<TingkatPrestasi, string> = {
  internasional: "Internasional",
  nasional: "Nasional",
  daerah: "Daerah",
};