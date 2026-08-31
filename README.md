# Sistem Repository Tugas Akhir — Jurusan Teknik Otomotif UNP

Boilerplate Next.js 14 (App Router + TypeScript + Tailwind + Supabase) yang sudah
distruktur mengikuti use case diagram (Pengunjung, Mahasiswa, Dosen, Admin).

## Cara jalanin

1. `npm install`
2. Buat project di https://supabase.com, lalu buka **SQL Editor** dan jalankan file
   `schema-sistem-repository-ta.sql` (dari langkah sebelumnya) dari atas ke bawah.
3. Copy `.env.example` ke `.env.local`, isi dengan URL & anon key dari Supabase
   (Project Settings > API).
4. `npm run dev` → buka `http://localhost:3000`

## Kenapa strukturnya begini

- **`middleware.ts`** — satu tempat yang jagain siapa boleh buka
  `/dashboard/mahasiswa`, `/dashboard/dosen`, `/dashboard/admin` berdasarkan kolom
  `role` di tabel `profiles`. Kalau ketahuan buka dashboard role lain, otomatis
  dilempar balik.
- **`lib/supabase/`** — 3 client terpisah (browser, server, middleware) sesuai
  rekomendasi resmi `@supabase/ssr`, biar session-nya sinkron di semua tempat.
- **`lib/actions/ta.ts`** — Server Actions buat alur inti (upload TA, verifikasi,
  ambil signed URL download). File PDF distream langsung ke Supabase Storage,
  **tidak pernah** mampir ke disk lokal server atau device — ini yang menjawab
  syarat dosen pembimbing.
- Setiap halaman punya komentar `// Use case: "..."` di baris atas yang
  menunjukkan use case diagram mana yang dia kerjakan.

## Peta use case -> route

| Use Case | Aktor | Route |
|---|---|---|
| Mencari & Menjelajahi Katalog TA | Pengunjung | `/` |
| Melihat Detail, Abstrak & Kutipan TA | Pengunjung | `/ta/[id]` |
| Mengunduh Dokumen TA | Pengunjung | `/ta/[id]` (tombol unduh) |
| Melihat Dashboard Statistik | Pengunjung | `/statistik` |
| Tentang Jurusan Teknik Otomotif | Pengunjung | `/tentang` |
| Registrasi & Login | Mahasiswa/Dosen | `/login`, `/register` |
| Mengunggah Tugas Akhir | Mahasiswa | `/dashboard/mahasiswa/upload` |
| Status Pengajuan TA | Mahasiswa | `/dashboard/mahasiswa/status` |
| Mendaftar Ujian Kompre / Sidang TA | Mahasiswa | `/dashboard/mahasiswa/kompre` |
| Melihat Rekap Dosen & Ekspor Excel | Dosen | `/dashboard/dosen/rekap` |
| Memverifikasi Pengajuan TA | Admin | `/dashboard/admin/verifikasi` |
| Mengelola Pengguna | Admin | `/dashboard/admin/pengguna` |
| Mengelola Master Data | Admin | `/dashboard/admin/master-data` |
| Mengelola Pendaftar Kompre & Alokasi Penguji | Admin | `/dashboard/admin/kompre` |
| Melihat Log Aktivitas | Admin | `/dashboard/admin/log` |

## Yang masih perlu dikerjain (ditandai `// TODO` di kode)

- Ganti input ID mentah (kategori, dosen pembimbing) jadi `<select>` beneran
  dari query `kategori_topik` / `profiles`
- Sambungkan tombol "Unduh" di `/ta/[id]` ke `getSignedDownloadUrl()`
- Grafik statistik pakai `recharts` (datanya sudah diambil, tinggal dirender)
- Tombol "Ekspor Excel" di rekap dosen pakai `exceljs`
- Halaman kelola pengguna & master data masih kerangka kosong
- Styling masih minimal — polish visual masuk di hari ke-6 rencana kerja
