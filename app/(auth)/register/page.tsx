"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const [form, setForm] = useState({ nama_lengkap: "", email: "", password: "", role: "mahasiswa", nim: "", nidn: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nama_lengkap: form.nama_lengkap,
          role: form.role,
          nim: form.role === "mahasiswa" ? form.nim : null,
          nidn: form.role === "dosen" ? form.nidn : null,
        },
      },
    });
    if (error) return setError(error.message);
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p>Registrasi berhasil, silakan cek email untuk verifikasi lalu masuk.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-primary-800">Daftar Akun</h1>
        {error && <p className="rounded-lg bg-amber-50 p-2 text-sm text-amber-800">{error}</p>}
        <input placeholder="Nama lengkap" value={form.nama_lengkap} onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
        <input type="password" placeholder="Kata sandi" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2">
          <option value="mahasiswa">Mahasiswa</option>
          <option value="dosen">Dosen</option>
        </select>
        {form.role === "mahasiswa" ? (
          <input placeholder="NIM" value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
        ) : (
          <input placeholder="NIDN" value={form.nidn} onChange={(e) => setForm({ ...form, nidn: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2" required />
        )}
        <button className="w-full rounded-lg bg-accent-500 py-2 font-medium text-white hover:bg-accent-600">Daftar</button>
        <p className="text-sm text-slate-500">
          Sudah punya akun? <a href="/login" className="font-medium text-primary-700 hover:underline">Masuk</a>
        </p>
      </form>
    </div>
  );
}