// Karya yang diunggah admin atas nama alumni menyimpan nama/NIM penulis di kolom sendiri.
// Fungsi ini menimpa data "mahasiswa" supaya semua halaman otomatis menampilkan penulis aslinya.
export function terapkanPenulis<T extends Record<string, any>>(r: T): T {
  if (!r?.penulis_nama) return r;
  return { ...r, mahasiswa: { nama_lengkap: r.penulis_nama, nim: r.penulis_nim ?? null } };
}