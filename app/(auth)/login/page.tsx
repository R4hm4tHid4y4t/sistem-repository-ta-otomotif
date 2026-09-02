"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setError(error.message);

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
    router.push(`/dashboard/${profile?.role ?? ""}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-primary-800">Masuk</h1>
        {error && <p className="rounded-lg bg-amber-50 p-2 text-sm text-amber-800">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
        <button className="w-full rounded-lg bg-accent-500 py-2 font-medium text-white hover:bg-accent-600">Masuk</button>
        <p className="text-sm text-slate-500">
          Belum punya akun? <Link href="/register" className="font-medium text-primary-700 hover:underline">Daftar</Link>
        </p>
      </form>
    </div>
  );
}