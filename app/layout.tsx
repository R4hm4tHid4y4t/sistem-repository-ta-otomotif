import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Repository TA - Teknik Otomotif UNP",
  description: "Sistem Repository Tugas Akhir Jurusan Teknik Otomotif Universitas Negeri Padang",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile: { role: string; nama_lengkap: string } | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("role, nama_lengkap").eq("id", user.id).single();
    profile = data;
  }

  const labelRole: Record<string, string> = { mahasiswa: "Mahasiswa", dosen: "Dosen", admin: "Admin" };

  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>
        <header className="bg-primary-700 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2 font-heading font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-sm">RT</span>
              <span>Repository TA <span className="hidden text-primary-200 sm:inline">· Teknik Otomotif UNP</span></span>
            </a>
            <nav className="flex items-center gap-5 text-sm">
              <a href="/" className="hover:text-accent-300">Beranda</a>
              <a href="/repositori" className="hover:text-accent-300">Repositori</a>
              {(!profile || profile.role === "mahasiswa") && (
                <a href="/statistik" className="hover:text-accent-300">Statistik</a>
              )}
              <a href="/tentang" className="hover:text-accent-300">Tentang</a>
              {profile?.role === "mahasiswa" && (
                <a href="/dashboard/mahasiswa/upload" className="hover:text-accent-300">Unggah TA</a>
              )}
              {profile?.role === "dosen" && (
                <a href="/dashboard/dosen" className="hover:text-accent-300">Dashboard</a>
              )}
              {profile?.role === "admin" && (
                <>
                  <a href="/dashboard/admin/dashboard" className="hover:text-accent-300">Dashboard</a>
                  <a href="/dashboard/admin" className="hover:text-accent-300">Panel Admin</a>
                </>
              )}
              <span className="mx-1 h-4 w-px bg-primary-500" />
              {profile ? (
                <>
                  <a
                    href={`/dashboard/${profile.role}`}
                    className="rounded-full bg-primary-500 px-3 py-1.5 font-medium text-white hover:bg-primary-400"
                  >
                    {labelRole[profile.role]} · {profile.nama_lengkap.split(" ")[0]}
                  </a>
                  <LogoutButton />
                </>
              ) : (
                <a href="/login" className="rounded-full bg-accent-500 px-4 py-1.5 font-medium hover:bg-accent-600">Masuk</a>
              )}
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-16 bg-primary-800 text-primary-100">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
            <div>
              <p className="font-heading font-semibold text-white">Repository Tugas Akhir</p>
              <p className="text-sm text-primary-300">Jurusan Teknik Otomotif · FT UNP</p>
              <p className="mt-2 text-sm">
                Platform digital terpusat untuk penyimpanan, pencarian, dan pengelolaan Tugas Akhir mahasiswa
                Program Studi S1 Pendidikan Teknik Otomotif dan D3 Teknik Otomotif.
              </p>
            </div>
            <div>
              <p className="font-heading font-semibold text-white">Tautan Cepat</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li><a href="/">Beranda</a></li>
                <li><a href="/repositori">Jelajahi Repositori</a></li>
                <li><a href="/dashboard/mahasiswa/upload">Unggah Tugas Akhir</a></li>
                <li><a href="/tentang">Tentang Jurusan</a></li>
              </ul>
            </div>
            <div>
              <p className="font-heading font-semibold text-white">Kontak</p>
              <p className="mt-2 text-sm">Gedung Teknik Otomotif, Jl. Prof. Dr. Hamka, Air Tawar Barat, Padang</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 border-t border-primary-700 py-4 text-center text-xs text-primary-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Sistem aktif ·
            © {new Date().getFullYear()} Jurusan Teknik Otomotif, Fakultas Teknik, Universitas Negeri Padang
          </div>
        </footer>
      </body>
    </html>
  );
}