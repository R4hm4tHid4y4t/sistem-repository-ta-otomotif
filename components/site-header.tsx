"use client";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

type Profile = { role: string; nama_lengkap: string } | null;

function getNavItems(profile: Profile) {
  const items = [
    { href: "/", label: "Beranda" },
    { href: "/repositori", label: "Repositori" },
  ];
  if (!profile || profile.role === "mahasiswa") {
    items.push({ href: "/statistik", label: "Statistik" });
  }
  items.push({ href: "/tentang", label: "Tentang" });
  if (profile?.role === "mahasiswa") {
    items.push({ href: "/dashboard/mahasiswa/upload", label: "Unggah Karya" });
  }
  if (profile?.role === "dosen") {
    items.push({ href: "/dashboard/dosen", label: "Dashboard" });
  }
  if (profile?.role === "admin") {
    items.push({ href: "/dashboard/admin/dashboard", label: "Dashboard" });
    items.push({ href: "/dashboard/admin", label: "Panel Admin" });
  }
  return items;
}

export function SiteHeader({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const navItems = getNavItems(profile);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow ring-1 ring-slate-100">
            <img src="/logo-otomotif.png" alt="Logo HIMA Teknik Otomotif UNP" className="h-8 w-8 object-contain" />
          </span>
          <span>
            <span className="block font-heading text-sm font-bold text-primary-800">Repositori Karya Ilmiah</span>
            <span className="block text-xs text-slate-500">Teknik Otomotif · FT UNP</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "rounded-full bg-primary-700 px-4 py-1.5 font-medium text-white"
                    : "rounded-full px-4 py-1.5 text-slate-600 hover:bg-slate-50"
                }
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {profile ? (
            <>
              <span className="hidden items-center rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium capitalize text-primary-800 sm:flex">
                {profile.role}
              </span>
              <LogoutButton />
            </>
          ) : (
            <a href="/login" className="rounded-full bg-accent-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-600">
              Masuk
            </a>
          )}
        </div>
      </div>
    </header>
  );
}