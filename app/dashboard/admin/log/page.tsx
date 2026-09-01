// Use case: "Melihat Log Aktivitas"
import { createClient } from "@/lib/supabase/server";

export default async function LogAktivitasPage() {
  const supabase = createClient();
  const { data: log } = await supabase
    .from("log_aktivitas")
    .select("aksi, deskripsi, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-primary-800">Log Aktivitas</h1>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {(log ?? []).map((l, i) => (
          <li key={i} className="flex items-center justify-between p-3 text-sm">
            <span>
              <span className="text-xs text-slate-400">{new Date(l.created_at).toLocaleString("id-ID")}</span> — {l.aksi}: {l.deskripsi}
            </span>
            {l.aksi === "upload_ta" && (
              <span className="shrink-0 rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Tayang</span>
            )}
          </li>
        ))}
        {(log ?? []).length === 0 && <li className="p-3 text-slate-500">Belum ada aktivitas.</li>}
      </ul>
    </div>
  );
}