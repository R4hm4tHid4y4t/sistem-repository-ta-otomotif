// Tipe TypeScript yang mengikuti skema SQL (schema-sistem-repository-ta.sql)
// Sinkronkan manual kalau skema berubah, atau generate otomatis nanti pakai
// `supabase gen types typescript`.

export type UserRole = "mahasiswa" | "dosen" | "admin";
export type StatusVerifikasiTA = "pending" | "diterima" | "ditolak";
export type StatusKompre = "menunggu" | "disetujui" | "ditolak" | "selesai";
export type PeranPenguji = "pembimbing" | "penguji_1" | "penguji_2" | "ketua_sidang";
export type Prodi = "s1_pend_otomotif" | "d3_otomotif";
export type JenisDoc = "ta" | "jurnal" | "laporan_pkl" | "laporan_praktek_industri";
export type Bidang = "kependidikan" | "non_kependidikan";

export interface Profile {
  id: string;
  role: UserRole;
  nama_lengkap: string;
  email: string;
  nim: string | null;
  nidn: string | null;
  no_hp: string | null;
  avatar_url: string | null;
  jabatan: string | null;
  created_at: string;
  updated_at: string;
}

export interface KategoriTopik {
  id: string;
  nama_kategori: string;
  deskripsi: string | null;
  created_at: string;
}

export interface TugasAkhir {
  id: string;
  judul: string;
  abstrak: string;
  kata_kunci: string[];
  file_path: string;
  file_size_kb: number | null;
  tahun: number;
  prodi: Prodi;
  sdgs: number[];
  kbk: string | null;
  jenis_doc: JenisDoc;
  bidang: Bidang | null;
  mahasiswa_id: string;
  dosen_pembimbing_id: string | null;
  dosen_pembimbing_2_id: string | null;
  dosen_penguji_1_id: string | null;
  dosen_penguji_2_id: string | null;
  dosen_penguji_3_id: string | null;
  nama_perusahaan: string | null;
  alamat_perusahaan: string | null;
  nama_pembimbing_lapangan: string | null;
  jabatan_pembimbing_lapangan: string | null;
  koordinator_pli_id: string | null;
  tanggal_mulai_pli: string | null;
  tanggal_selesai_pli: string | null;
  semester_pelaksanaan: string | null;
  kategori_id: string | null;
  status_verifikasi: StatusVerifikasiTA;
  catatan_verifikasi: string | null;
  verified_by: string | null;
  verified_at: string | null;
  jumlah_dilihat: number;
  jumlah_diunduh: number;
  created_at: string;
  updated_at: string;
}

export interface PendaftaranKompre {
  id: string;
  mahasiswa_id: string;
  tugas_akhir_id: string | null;
  status: StatusKompre;
  tanggal_pengajuan: string;
  jadwal_sidang: string | null;
  lokasi_sidang: string | null;
  catatan_admin: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlokasiPenguji {
  id: string;
  pendaftaran_kompre_id: string;
  dosen_id: string;
  peran: PeranPenguji;
  created_at: string;
}

export interface LogAktivitas {
  id: string;
  user_id: string | null;
  aksi: string;
  deskripsi: string | null;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
}