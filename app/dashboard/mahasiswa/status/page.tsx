import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function KaryaSayaPage({
  searchParams,
}: {
  searchParams: { uploaded?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: daftarKarya } = await supabase
    .from("karya")
    .select("id, judul, tahun, status_verifikasi")
    .eq("mahasiswa_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-primary-800">Karya Saya</h1>
      {searchParams.uploaded && (
        <p className="mb-4 rounded bg-primary-50 p-3 text-sm text-primary-700">
          Karya berhasil diunggah dan langsung tayang di repositori.
        </p>
      )}
      <ul className="space-y-2">
        {(daftarKarya ?? []).map((karya) => (
          <li key={karya.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div>
              <Link href={`/karya/${karya.id}`} className="font-medium text-primary-700 hover:underline">{karya.judul}</Link>
              <p className="text-sm text-slate-500">{karya.tahun}</p>
            </div>
            {karya.status_verifikasi === "ditolak" ? (
              <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">Ditarik oleh admin</span>
            ) : (
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Tayang</span>
            )}
          </li>
        ))}
        {(daftarKarya ?? []).length === 0 && <p className="text-slate-500">Kamu belum mengunggah Karya.</p>}
      </ul>
    </div>
  );
}