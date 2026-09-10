import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Repositori Karya Ilmiah - Teknik Otomotif UNP",
  description: "Sistem Repositori Karya Ilmiah Jurusan Teknik Otomotif Universitas Negeri Padang",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile: { role: string; nama_lengkap: string } | null = null;
  
  if (user) {
    const { data } = await supabase.from("profiles").select("role, nama_lengkap").eq("id", user.id).single();
    profile = data;
  }

  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>
        <SiteHeader profile={profile} />

        <main>{children}</main>

        {/* Footer Diperbarui */}
        <footer className="mt-16 bg-[#27376D] text-[#C1CDEB]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-12">
            
            {/* Kolom 1: Info & Deskripsi */}
            <div className="md:col-span-6 lg:col-span-6">
              <div className="mb-4 flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1">
                  <img src="/logo-otomotif.png" alt="Logo HIMA Teknik Otomotif UNP" className="h-full w-full object-contain" />
                </span>
                <div>
                  <p className="font-heading text-lg font-bold text-white">Repositori Karya Ilmiah</p>
                  <p className="text-sm text-[#879BD7]">Jurusan Teknik Otomotif · FT UNP</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#D2DCF5]">
                Platform digital terpusat untuk penyimpanan, pencarian, dan pengelolaan karya ilmiah
                mahasiswa Program Studi S1 Pendidikan Teknik Otomotif dan D3 Teknik Otomotif.
              </p>
              
              {/* Badge Program Studi */}
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded bg-[#E77D2A] px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                  S1 Pend. Teknik Otomotif
                </span>
                <span className="rounded bg-[#3A4B8A] border border-[#4B5EAA] px-3 py-1.5 text-xs font-medium text-[#D2DCF5]">
                  D3 Teknik Otomotif
                </span>
              </div>
            </div>

            {/* Kolom 2: Tautan Cepat */}
            <div className="md:col-span-3 lg:col-span-3">
              <p className="font-heading font-semibold text-white">Tautan Cepat</p>
              <ul className="mt-5 space-y-4 text-sm">
                <li><a href="/" className="transition-colors hover:text-white">Beranda</a></li>
                <li><a href="/repositori" className="transition-colors hover:text-white">Jelajahi Repositori</a></li>
                <li><a href="/dashboard/mahasiswa/upload" className="transition-colors hover:text-white">Unggah Karya</a></li>
                <li><a href="/tentang" className="transition-colors hover:text-white">Tentang Jurusan</a></li>
              </ul>
            </div>

            {/* Kolom 3: Kontak */}
            <div className="md:col-span-3 lg:col-span-3">
              <p className="font-heading font-semibold text-white">Kontak</p>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#879BD7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    Jurusan Teknik Otomotif, Fakultas Teknik, Universitas Negeri Padang, Kampus UNP Air Tawar, Jl. Prof. Dr. Hamka, Padang<br />
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 shrink-0 text-[#879BD7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>otomotif@ft.unp.ac.id</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & System Status */}
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-[#3A4B8A] py-6 text-xs text-[#879BD7] sm:flex-row">
              <p>© {new Date().getFullYear()} Jurusan Teknik Otomotif, Fakultas Teknik, Universitas Negeri Padang</p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#34D399]" /> 
                <span>Sistem aktif · v1.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}