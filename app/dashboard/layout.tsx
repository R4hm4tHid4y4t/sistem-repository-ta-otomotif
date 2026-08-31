import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const MENU: Record<string, { href: string; label: string }[]> = {
  mahasiswa: [
    { href: "/dashboard/mahasiswa", label: "Ringkasan" },
    { href: "/dashboard/mahasiswa/upload", label: "Unggah TA" },
    { href: "/dashboard/mahasiswa/status", label: "TA Saya" },
    { href: "/dashboard/mahasiswa/kompre", label: "Daftar Ujian Kompre" },
  ],
  dosen: [
    { href: "/dashboard/dosen", label: "Ringkasan" },
    { href: "/dashboard/dosen/rekap", label: "Rekap & Ekspor Excel" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Ringkasan" },
    { href: "/dashboard/admin/verifikasi", label: "Kelola TA" },
    { href: "/dashboard/admin/pengguna", label: "Kelola Pengguna" },
    { href: "/dashboard/admin/master-data", label: "Master Data" },
    { href: "/dashboard/admin/kompre", label: "Pendaftar Kompre & Penguji" },
    { href: "/dashboard/admin/log", label: "Log Aktivitas" },
  ],
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  const menu = MENU[profile.role] ?? [];

  return (
    <div className="grid grid-cols-[200px_1fr] gap-6">
      <aside className="space-y-1 border-r border-slate-200 pr-4">
        <p className="mb-3 text-sm font-medium text-slate-500">Halo, {profile.nama_lengkap}</p>
        {menu.map((item) => (
          <a key={item.href} href={item.href} className="block rounded px-2 py-1.5 text-sm hover:bg-primary-50">
            {item.label}
          </a>
        ))}
      </aside>
      <section>{children}</section>
    </div>
  );
}
