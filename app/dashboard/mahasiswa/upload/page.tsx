import { createClient } from "@/lib/supabase/server";
import { UploadWizard } from "./upload-wizard";

export default async function UploadTAPage() {
  const supabase = createClient();
  const [{ data: kategoriList }, { data: dosenList }] = await Promise.all([
    supabase.from("kategori_topik").select("id, nama_kategori").order("nama_kategori"),
    supabase.from("profiles").select("id, nama_lengkap, jabatan").eq("role", "dosen").order("nama_lengkap"),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold text-primary-800">Unggah Tugas Akhir</h1>
      <p className="mt-1 text-sm text-slate-500">
        TA yang sudah diunggah akan langsung tayang di repositori tanpa proses review.
      </p>
      <UploadWizard kategoriList={kategoriList ?? []} dosenList={dosenList ?? []} />
    </div>
  );
}