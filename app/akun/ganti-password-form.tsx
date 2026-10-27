"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { validasiPassword } from "@/lib/password";

export function GantiPasswordForm({ email }: { email: string }) {
  const supabase = createClient();
  const [lama, setLama] = useState("");
  const [baru, setBaru] = useState("");
  const [ulang, setUlang] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sukses, setSukses] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSukses(false);

    const pesanPassword = validasiPassword(baru);
    if (pesanPassword) return setError(pesanPassword);
    if (baru !== ulang) return setError("Konfirmasi password tidak sama.");
    if (baru === lama) return setError("Password baru harus berbeda dari password saat ini.");

    startTransition(async () => {
      const { error: errLama } = await supabase.auth.signInWithPassword({ email, password: lama });
      if (errLama) {
        setError("Password saat ini salah.");
        return;
      }
      const { error: errBaru } = await supabase.auth.updateUser({ password: baru });
      if (errBaru) {
        setError(errBaru.message);
        return;
      }
      setSukses(true);
      setLama("");
      setBaru("");
      setUlang("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs text-slate-400">Akun</p>
        <p className="font-medium text-slate-700">{email}</p>
      </div>

      {error && <p className="rounded-lg bg-amber-50 p-2 text-sm text-amber-800">{error}</p>}
      {sukses && <p className="rounded-lg bg-green-50 p-2 text-sm text-green-700">Password berhasil diganti.</p>}

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-primary-800">Password saat ini</span>
        <input type="password" value={lama} onChange={(e) => setLama(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-primary-800">Password baru</span>
        <input type="password" value={baru} onChange={(e) => setBaru(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <span className="mt-1 block text-xs text-slate-500">Minimal 8 karakter, memuat huruf besar, huruf kecil, angka, dan simbol.</span>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-primary-800">Ulangi password baru</span>
        <input type="password" value={ulang} onChange={(e) => setUlang(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>

      <button disabled={isPending} className="w-full rounded-lg bg-accent-500 py-2 font-medium text-white hover:bg-accent-600 disabled:opacity-50">
        {isPending ? "Menyimpan..." : "Ganti Kata Sandi"}
      </button>
    </form>
  );
}