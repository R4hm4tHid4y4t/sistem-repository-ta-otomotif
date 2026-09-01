// Use case: "Mengelola Master Data" — bagian Kategori/Topik
import { createClient } from "@/lib/supabase/server";
import { KategoriManager } from "./kategori-manager";

export default async function KategoriPage() {
  const supabase = createClient();
  const { data: kategoriList } = await supabase.from("kategori_topik").select("id, nama_kategori, deskripsi").order("nama_kategori");

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-primary-800">Kategori / Topik TA</h1>
      <KategoriManager kategoriList={kategoriList ?? []} />
    </div>
  );
}