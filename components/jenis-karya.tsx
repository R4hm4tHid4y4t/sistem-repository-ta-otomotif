import { createClient } from "@/lib/supabase/server";
import { LABEL_JENIS_DOC, type JenisDoc } from "@/lib/klasifikasi";

const URUTAN: JenisDoc[] = [
  "ta",
  "jurnal",
  "laporan_praktek_industri",
  "laporan_pkl",
  "laporan_ptk",
  "prestasi",
];

export async function JenisKarya() {
  const supabase = await createClient();
  const hasil = await Promise.all(
    URUTAN.map((j) =>
      supabase
        .from("tugas_akhir")
        .select("*", { count: "exact", head: true })
        .eq("status_verifikasi", "diterima")
        .eq("jenis_doc", j)
    )
  );

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10">
      <h2 className="mb-4 text-lg font-heading font-semibold text-primary-800">Jelajahi Berdasarkan Jenis Karya</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {URUTAN.map((j, i) => (
          <a
            key={j}
            href={`/repositori?jenis=${j}`}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-2xl font-heading font-bold text-accent-500">
              {(hasil[i].count ?? 0).toLocaleString("id-ID")}
            </p>
            <p className="mt-1 text-sm font-medium text-primary-800">{LABEL_JENIS_DOC[j]}</p>
          </a>
        ))}
      </div>
    </section>
  );
}