// Use case: "Mengelola Master Data" — bagian Dosen
import { createClient } from "@/lib/supabase/server";
import { DosenRow } from "../master-dosen/dosen-row";

export default async function MasterDosenPage() {
  const supabase = createClient();
  const { data: dosenList } = await supabase
    .from("profiles")
    .select("id, nama_lengkap, nidn, jabatan")
    .eq("role", "dosen")
    .order("nama_lengkap");

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-primary-800">Master Data Dosen</h1>
      <p className="mb-4 text-sm text-slate-500">Kelola nama, NIDN, dan jabatan dosen. Untuk menambah dosen baru, buat akunnya dulu di Authentication → Users, lalu naikkan role-nya di Kelola Pengguna.</p>
      <ul className="rounded border border-slate-200">
        {(dosenList ?? []).map((d) => <DosenRow key={d.id} dosen={d} />)}
        {(dosenList ?? []).length === 0 && <li className="p-3 text-slate-500">Belum ada dosen terdaftar.</li>}
      </ul>
    </div>
  );
}