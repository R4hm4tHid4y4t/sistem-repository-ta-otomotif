import { NextResponse } from "next/server";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";
import { pathAman } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIPE: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });

  // Pakai akun pengguna: aturan RLS ikut berlaku (hanya karya yang boleh dia lihat)
  const { data: ta } = await supabase.from("tugas_akhir").select("file_path").eq("id", id).single();
  if (!ta?.file_path) return NextResponse.json({ error: "Berkas tidak ditemukan." }, { status: 404 });

  let lokasi: string | null = null;
  try {
    lokasi = pathAman(ta.file_path);
  } catch {
    lokasi = null;
  }
  if (!lokasi) return NextResponse.json({ error: "Path berkas tidak valid." }, { status: 400 });

  const info = await stat(/*turbopackIgnore: true*/ lokasi).catch(() => null);
  if (!info) return NextResponse.json({ error: "File tidak ada di penyimpanan." }, { status: 404 });

  await supabase.rpc("increment_unduhan", { ta_id: id });

  const ext = path.extname(lokasi).toLowerCase();
  const namaFile = path.basename(lokasi).replace(/^\d+-/, "");
  const stream = Readable.toWeb(createReadStream(/*turbopackIgnore: true*/ lokasi)) as unknown as ReadableStream;

  return new NextResponse(stream, {
    headers: {
      "Content-Type": TIPE[ext] ?? "application/octet-stream",
      "Content-Length": String(info.size),
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(namaFile)}`,
      "Cache-Control": "private, no-store",
    },
  });
}