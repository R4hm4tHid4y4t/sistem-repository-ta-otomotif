"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateDosen(
  id: string,
  nama_lengkap: string,
  nidn: string,
  jabatan: string,
  kode_dosen: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      nama_lengkap: nama_lengkap.trim(),
      nidn: nidn.trim() || null,
      jabatan: jabatan.trim() || null,
      kode_dosen: kode_dosen.trim() || null,
    })
    .eq("id", id);
  if (error) {
    if (error.code === "23505") return { error: "Kode dosen sudah dipakai dosen lain." };
    console.error("updateDosen gagal:", error);
    return { error: "Gagal menyimpan data dosen." };
  }
  revalidatePath("/dashboard/admin/master-data");
  return {};
}

async function pastikanAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, ok: false };
  const { data: profil } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return { supabase, ok: profil?.role === "admin" };
}

export async function tambahDosen(input: {
  nama_lengkap: string;
  kode_dosen: string;
  nidn: string;
  jabatan: string;
}): Promise<{ error?: string }> {
  const { supabase, ok } = await pastikanAdmin();
  if (!ok) return { error: "Hanya admin yang boleh menambah dosen." };

  const nama = input.nama_lengkap.trim();
  if (!nama) return { error: "Nama lengkap wajib diisi." };

  const { error } = await supabase.from("profiles").insert({
    nama_lengkap: nama,
    role: "dosen",
    kode_dosen: input.kode_dosen.trim() || null,
    nidn: input.nidn.trim() || null,
    jabatan: input.jabatan.trim() || null,
  });
  if (error) {
    if (error.code === "23505") return { error: "Kode dosen sudah dipakai dosen lain." };
    console.error("tambahDosen gagal:", error);
    return { error: "Gagal menambah dosen." };
  }
  revalidatePath("/dashboard/admin/master-data");
  return {};
}

export async function tambahKategori(nama_kategori: string, deskripsi: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("kategori_topik").insert({ nama_kategori, deskripsi: deskripsi || null });
  if (error) throw error;
  revalidatePath("/dashboard/admin/kategori");
}

export async function updateKategori(id: string, nama_kategori: string, deskripsi: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("kategori_topik").update({ nama_kategori, deskripsi: deskripsi || null }).eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard/admin/kategori");
}

export async function hapusKategori(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("kategori_topik").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard/admin/kategori");
} 