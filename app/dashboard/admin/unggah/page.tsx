import { createClient } from "@/lib/supabase/server";
import { getDaftarSdgs } from "@/lib/sdgs";
import { UploadWizard } from "@/app/dashboard/mahasiswa/upload/upload-wizard";

export default async function AdminUnggahPage({ searchParams }: { searchParams: { berhasil?: string } }) {
  const supabase = createClient();
  const [{ data: kategoriList }, { data: dosenList }, sdgsList] = await Promise.all([
    supabase.from("kategori_topik").select("id, nama_kategori").order("nama_kategori"),
    supabase.from("profiles").select("id, nama_lengkap, jabatan").eq("role", "dosen").order("nama_lengkap"),
    getDaftarSdgs(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold text-primary-800">Unggah Karya (Data Alumni)</h1>
      <p className="mt-1 text-sm text-slate-500">
        Untuk memasukkan karya alumni yang sudah lama lulus, atas nama penulis aslinya.
      </p>
      {searchParams.berhasil && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">Karya berhasil diunggah. Silakan lanjut ke karya berikutnya.</p>
      )}
      <UploadWizard
        key={searchParams.berhasil ?? "baru"}
        kategoriList={kategoriList ?? []}
        dosenList={dosenList ?? []}
        sdgsList={sdgsList}
      />
    </div>
  );
}