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
      <ul className="space-y-1 text-sm">
        {(log ?? []).map((l, i) => (
          <li key={i} className="border-b py-1">
            <span className="text-slate-400">{l.created_at}</span> — {l.aksi}: {l.deskripsi}
          </li>
        ))}
      </ul>
    </div>
  );
}
