"use client";
// Use case: "Registrasi & Login"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    router.push(`/dashboard/${profile?.role ?? ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-3">
      <h1 className="text-xl font-semibold text-primary-800">Masuk</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border border-slate-300 px-3 py-2"
        required
      />
      <input
        type="password"
        placeholder="Kata sandi"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded border border-slate-300 px-3 py-2"
        required
      />
      <button className="w-full rounded bg-primary-600 py-2 text-white">Masuk</button>
      <p className="text-sm">
        Belum punya akun? <a href="/register" className="text-primary-700">Daftar</a>
      </p>
    </form>
  );
}
