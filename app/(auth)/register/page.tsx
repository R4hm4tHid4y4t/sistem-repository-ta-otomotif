"use client";
// Use case: "Registrasi & Login" — registrasi Mahasiswa/Dosen
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const [form, setForm] = useState({ nama_lengkap: "", email: "", password: "", role: "mahasiswa" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { nama_lengkap: form.nama_lengkap, role: form.role } },
    });
    if (error) return setError(error.message);
    setDone(true);
  }

  if (done) return <p>Registrasi berhasil, silakan cek email untuk verifikasi lalu masuk.</p>;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-3">
      <h1 className="text-xl font-semibold text-primary-800">Daftar Akun</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input placeholder="Nama lengkap" value={form.nama_lengkap} onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" required />
      <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" required />
      <input type="password" placeholder="Kata sandi" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" required />
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2">
        <option value="mahasiswa">Mahasiswa</option>
        <option value="dosen">Dosen</option>
      </select>
      <button className="w-full rounded bg-primary-600 py-2 text-white">Daftar</button>
    </form>
  );
}