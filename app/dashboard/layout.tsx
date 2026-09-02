import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserAndProfile } from "@/lib/supabase/get-profile";

const MENU: Record<string, { href: string; label: string }[]> = {
  mahasiswa: [
    { href: "/dashboard/mahasiswa", label: "Ringkasan" },
    { href: "/dashboard/mahasiswa/upload", label: "Unggah TA" },
    { href: "/dashboard/mahasiswa/status", label: "TA Saya" },
  ],
  dosen: [
    { href: "/dashboard/dosen", label: "Ringkasan" },
    { href: "/dashboard/dosen/rekap", label: "Rekap & Ekspor Excel" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Ringkasan" },
    { href: "/dashboard/admin/dashboard", label: "Dashboard" },
    { href: "/dashboard/admin/verifikasi", label: "Kelola TA" },
    { href: "/dashboard/admin/pengguna", label: "Kelola Pengguna" },
    { href: "/dashboard/admin/master-data", label: "Master Dosen" },
    { href: "/dashboard/admin/kategori", label: "Kategori & SDGs" },
    { href: "/dashboard/admin/log", label: "Log Aktivitas" },
  ],
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Gunakan cache data auth agar tidak memicu fetch berulang
  const { user, profile } = await getUserAndProfile();
  
  if (!user || !profile) redirect("/login");

  const menu = MENU[profile.role] ?? [];

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-[220px_1fr] gap-6 px-4 py-8">
      <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <p className="mb-3 px-2 text-sm font-medium text-slate-500">Halo, {profile.nama_lengkap}</p>
        <nav className="space-y-1">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm text-primary-800 hover:bg-primary-50">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}