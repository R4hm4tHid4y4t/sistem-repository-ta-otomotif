"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSdgMaster(nomor: number, nama: string, warna: string, deskripsi: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("sdgs_master")
    .update({ nama, warna, deskripsi: deskripsi || null })
    .eq("nomor", nomor);
  if (error) throw error;
  revalidatePath("/dashboard/admin/sdgs");
}