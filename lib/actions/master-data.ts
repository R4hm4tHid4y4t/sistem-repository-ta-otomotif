"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateDosen(id: string, nama_lengkap: string, nidn: string, jabatan: string) {
  const supabase = createClient();
  const { error } = await supabase.from("profiles").update({ nama_lengkap, nidn: nidn || null, jabatan: jabatan || null }).eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard/admin/master-dosen");
}

export async function tambahKategori(nama_kategori: string, deskripsi: string) {
  const supabase = createClient();
  const { error } = await supabase.from("kategori_topik").insert({ nama_kategori, deskripsi: deskripsi || null });
  if (error) throw error;
  revalidatePath("/dashboard/admin/kategori");
}

export async function updateKategori(id: string, nama_kategori: string, deskripsi: string) {
  const supabase = createClient();
  const { error } = await supabase.from("kategori_topik").update({ nama_kategori, deskripsi: deskripsi || null }).eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard/admin/kategori");
}

export async function hapusKategori(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("kategori_topik").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard/admin/kategori");
} 