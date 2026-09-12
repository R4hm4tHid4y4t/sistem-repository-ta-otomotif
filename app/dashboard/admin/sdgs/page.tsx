import { createClient } from "@/lib/supabase/server";
import { SdgManager } from "./sdgs-manager";

export default async function KelolaSdgsPage() {
  const supabase = createClient();
  const { data: sdgsList } = await supabase.from("sdgs_master").select("*").order("nomor");

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-primary-800">Kelola SDGs</h1>
      <p className="mb-4 text-sm text-slate-500">
        17 tujuan SDGs bersifat tetap secara global — di sini kamu hanya bisa menyesuaikan nama, warna, dan deskripsi, bukan menambah atau menghapus.
      </p>
      <SdgManager sdgsList={sdgsList ?? []} />
    </div>
  );
}