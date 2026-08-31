"use client";
// Use case: "Mendaftar Ujian Kompre / Sidang TA"
import { createClient } from "@/lib/supabase/client";

export default function DaftarKomprePage() {
  const supabase = createClient();

  async function daftar(formData: FormData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("pendaftaran_kompre").insert({
      mahasiswa_id: user.id,
      tugas_akhir_id: formData.get("tugas_akhir_id"),
    });
  }

  return (
    <form action={daftar} className="max-w-md space-y-3">
      <h1 className="text-xl font-semibold text-primary-800">Daftar Ujian Kompre / Sidang TA</h1>
      {/* TODO: ganti jadi <select> daftar TA milik mahasiswa yang statusnya "diterima" */}
      <input name="tugas_akhir_id" placeholder="ID Tugas Akhir" className="w-full rounded border px-3 py-2" required />
      <button className="rounded bg-primary-600 px-4 py-2 text-white">Daftar</button>
    </form>
  );
}
