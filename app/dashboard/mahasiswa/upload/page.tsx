import { createClient } from "@/lib/supabase/server";
import { getDaftarSdgs } from "@/lib/sdgs";
import { UploadWizard } from "./upload-wizard";

export default async function UploadTAPage() {
  const supabase = createClient();
  const [{ data: kategoriList }, { data: dosenList }, sdgsList] = await Promise.all([
    supabase.from("kategori_topik").select("id, nama_kategori").order("nama_kategori"),
    supabase.from("profiles").select("id, nama_lengkap, jabatan").eq("role", "dosen").order("nama_lengkap"),
    getDaftarSdgs(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold text-primary-800">Unggah Karya</h1>
      <p className="mt-1 text-sm text-slate-500">
        Karya yang sudah diunggah akan langsung tayang di repositori tanpa proses review.
      </p>
      <UploadWizard kategoriList={kategoriList ?? []} dosenList={dosenList ?? []} sdgsList={sdgsList} />
    </div>
  );
}