"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadTugasAkhir(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Harus login sebagai mahasiswa.");

  const file = formData.get("file") as File;
  const judul = formData.get("judul") as string;
  const abstrak = formData.get("abstrak") as string;
  const prodi = (formData.get("prodi") as string) || "s1_pend_otomotif";
  const kategori_id = (formData.get("kategori_id") as string) || null;
  const tahun = Number(formData.get("tahun"));
  const kbk = (formData.get("kbk") as string) || null;
  const jenis_doc = (formData.get("jenis_doc") as string) || "ta";
  const bidang = (formData.get("bidang") as string) || null;

  const kataKunciRaw = (formData.get("kata_kunci") as string) || "";
  const kata_kunci = kataKunciRaw.split(",").map((s) => s.trim()).filter(Boolean);

  const sdgsRaw = (formData.get("sdgs") as string) || "";
  const sdgs = sdgsRaw.split(",").map(Number).filter((n) => !Number.isNaN(n));

  const dosen_pembimbing_id = (formData.get("dosen_pembimbing_id") as string) || null;
  const dosen_pembimbing_2_id = (formData.get("dosen_pembimbing_2_id") as string) || null;
  const dosen_penguji_1_id = (formData.get("dosen_penguji_1_id") as string) || null;
  const dosen_penguji_2_id = (formData.get("dosen_penguji_2_id") as string) || null;
  const dosen_penguji_3_id = (formData.get("dosen_penguji_3_id") as string) || null;

  if (!file || file.size === 0) throw new Error("File PDF wajib diunggah.");

  const filePath = `${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("dokumen-ta")
    .upload(filePath, file, { contentType: "application/pdf", upsert: false });
  if (uploadError) throw uploadError;

  const { error: insertError } = await supabase.from("tugas_akhir").insert({
    judul,
    abstrak,
    prodi,
    kata_kunci,
    sdgs,
    kbk,
    jenis_doc,
    bidang,
    kategori_id,
    dosen_pembimbing_id,
    dosen_pembimbing_2_id,
    dosen_penguji_1_id,
    dosen_penguji_2_id,
    dosen_penguji_3_id,
    tahun,
    mahasiswa_id: user.id,
    file_path: filePath,
    file_size_kb: Math.round(file.size / 1024),
    status_verifikasi: "diterima",
  });
  if (insertError) throw insertError;

  await supabase.from("log_aktivitas").insert({
    user_id: user.id,
    aksi: "upload_ta",
    deskripsi: `Mengunggah TA: ${judul}`,
  });

  revalidatePath("/dashboard/mahasiswa/status");
}

export async function verifikasiTugasAkhir(
  taId: string,
  status: "diterima" | "ditolak",
  catatan?: string
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Harus login sebagai admin.");

  const { error } = await supabase
    .from("tugas_akhir")
    .update({
      status_verifikasi: status,
      catatan_verifikasi: catatan ?? null,
      verified_by: user.id,
      verified_at: new Date().toISOString(),
    })
    .eq("id", taId);
  if (error) throw error;

  await supabase.from("log_aktivitas").insert({
    user_id: user.id,
    aksi: "verifikasi_ta",
    deskripsi: `TA ${taId} diubah ke status ${status}`,
    entity_type: "tugas_akhir",
    entity_id: taId,
  });

  revalidatePath("/dashboard/admin/verifikasi");
  revalidatePath("/");
}

export async function getSignedDownloadUrl(taId: string) {
  const supabase = createClient();

  const { data: ta, error } = await supabase
    .from("tugas_akhir")
    .select("file_path")
    .eq("id", taId)
    .single();
  if (error || !ta) throw new Error("TA tidak ditemukan.");

  const { data: signed, error: signError } = await supabase.storage
    .from("dokumen-ta")
    .createSignedUrl(ta.file_path, 60);
  if (signError) throw signError;

  try {
    await supabase.rpc("increment_unduhan", { ta_id: taId });
  } catch {
    // diamkan, ini bukan fitur kritis
  }

  return signed.signedUrl;
}