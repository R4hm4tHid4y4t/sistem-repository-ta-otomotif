import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const STORAGE_DIR = path.resolve(process.env.FILE_STORAGE_DIR ?? "/mnt/e/repositori-files");

try {
  await stat(path.join(STORAGE_DIR, ".repositori-storage"));
} catch {
  console.error("Folder penyimpanan belum siap / HDD belum terpasang. Berhenti.");
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function semuaBaris() {
  const hasil = [];
  for (let dari = 0; ; dari += 1000) {
    const { data, error } = await supabase
      .from("tugas_akhir")
      .select("id, file_path")
      .order("created_at")
      .range(dari, dari + 999);
    if (error) throw error;
    hasil.push(...data);
    if (data.length < 1000) break;
  }
  return hasil;
}

const rows = await semuaBaris();
let ok = 0, sudahAda = 0, gagal = 0;

for (const r of rows) {
  const tujuan = path.resolve(STORAGE_DIR, r.file_path);
  if (!tujuan.startsWith(STORAGE_DIR + path.sep)) {
    console.log("LEWATI (path aneh):", r.file_path);
    gagal++;
    continue;
  }
  try {
    await stat(tujuan);
    sudahAda++;
    continue;
  } catch {}

  const { data, error } = await supabase.storage.from("dokumen-ta").download(r.file_path);
  if (error || !data) {
    console.log("GAGAL:", r.file_path, error?.message);
    gagal++;
    continue;
  }
  await mkdir(path.dirname(tujuan), { recursive: true });
  await writeFile(tujuan, Buffer.from(await data.arrayBuffer()));
  ok++;
  console.log("OK:", r.file_path);
}

console.log(`Selesai. Total baris: ${rows.length} | Disalin: ${ok} | Sudah ada: ${sudahAda} | Gagal: ${gagal}`);