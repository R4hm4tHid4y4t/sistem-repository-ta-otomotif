import path from "node:path";
import { mkdir, writeFile, unlink, stat } from "node:fs/promises";
import { GalatPengguna } from "@/lib/galat";


export const STORAGE_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.FILE_STORAGE_DIR ?? "/mnt/e/repositori-files");
const PENANDA = ".repositori-storage";

// Pastikan path selalu di dalam STORAGE_DIR (cegah akses ke folder lain)
export function pathAman(relatif: string) {
  const lokasi = path.resolve(STORAGE_DIR, relatif);
  if (lokasi !== STORAGE_DIR && !lokasi.startsWith(STORAGE_DIR + path.sep)) {
    throw new Error("Path berkas tidak valid.");
  }
  return lokasi;
}

// Pastikan HDD benar-benar terpasang, bukan folder kosong di disk lain
async function pastikanDiskSiap() {
  try {
    await stat(path.join(STORAGE_DIR, PENANDA));
  } catch {
    throw new GalatPengguna("Penyimpanan berkas tidak siap (HDD belum terpasang). Hubungi admin.");
  }
}

export async function simpanBerkas(relatif: string, file: File) {
  await pastikanDiskSiap();
  const lokasi = pathAman(relatif);
  await mkdir(path.dirname(lokasi), { recursive: true });
  await writeFile(lokasi, Buffer.from(await file.arrayBuffer()));
}

export async function hapusBerkas(relatif: string) {
  try {
    await unlink(pathAman(relatif));
  } catch {
    // abaikan kalau file memang tidak ada
  }
}