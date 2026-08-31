// Use case: "Mengelola Pengguna"
export default function KelolaPenggunaPage() {
  return <h1 className="text-xl font-semibold text-primary-800">Kelola Pengguna</h1>;
  // TODO: tabel profiles (CRUD), reset password lewat supabase.auth.admin (perlu service role key, panggil dari Route Handler khusus)
}
