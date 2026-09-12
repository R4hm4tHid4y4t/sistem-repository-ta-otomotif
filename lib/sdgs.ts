import { createClient } from "@/lib/supabase/server";

export type SdgItem = { nomor: number; nama: string; warna: string; deskripsi: string | null };

export async function getDaftarSdgs(): Promise<SdgItem[]> {
  const supabase = createClient();
  const { data } = await supabase.from("sdgs_master").select("*").order("nomor");
  return data ?? [];
}

export function cariSdg(list: SdgItem[], nomor: number) {
  return list.find((s) => s.nomor === nomor);
}