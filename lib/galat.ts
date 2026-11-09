// Galat yang pesannya aman ditampilkan ke pengguna (validasi, penyimpanan belum siap, dll).
// Di mode produksi Next.js menyamarkan pesan Error biasa, jadi galat ini ditangkap di aksi
// dan dikembalikan sebagai teks.
export class GalatPengguna extends Error {}