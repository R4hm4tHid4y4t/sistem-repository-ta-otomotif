"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: "mahasiswa" | "dosen" | "admin") {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Harus login sebagai admin.");

  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) throw error;

  await supabase.from("log_aktivitas").insert({
    user_id: user.id,
    aksi: "ubah_role_pengguna",
    deskripsi: `Role pengguna diubah jadi ${role}`,
    entity_type: "profiles",
    entity_id: userId,
  });

  revalidatePath("/dashboard/admin/pengguna");
}