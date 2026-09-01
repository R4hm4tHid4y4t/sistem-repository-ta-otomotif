import { createClient } from "@/lib/supabase/server";

export default async function TASayaPage({
  searchParams,
}: {
  searchParams: { uploaded?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: daftarTA } = await supabase
    .from("tugas_akhir")
    .select("id, judul, tahun, status_verifikasi")
    .eq("mahasiswa_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-primary-800">TA Saya</h1>
      {searchParams.uploaded && (
        <p className="mb-4 rounded bg-primary-50 p-3 text-sm text-primary-700">
          TA berhasil diunggah dan langsung tayang di repositori.
        </p>
      )}
      <ul className="space-y-2">
        {(daftarTA ?? []).map((ta) => (
          <li key={ta.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div>
              <a href={`/ta/${ta.id}`} className="font-medium text-primary-700 hover:underline">{ta.judul}</a>
              <p className="text-sm text-slate-500">{ta.tahun}</p>
            </div>
            {ta.status_verifikasi === "ditolak" ? (
              <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">Ditarik oleh admin</span>
            ) : (
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Tayang</span>
            )}
          </li>
        ))}
        {(daftarTA ?? []).length === 0 && <p className="text-slate-500">Kamu belum mengunggah TA.</p>}
      </ul>
    </div>
  );
}