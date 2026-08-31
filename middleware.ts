// Proteksi route /dashboard/* berdasarkan role di tabel profiles.
// Ini yang menjawab pemisahan akses Mahasiswa / Dosen / Admin di use case diagram.
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ROLE_HOME: Record<string, string> = {
  mahasiswa: "/dashboard/mahasiswa",
  dosen: "/dashboard/dosen",
  admin: "/dashboard/admin",
};

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, profile } = await updateSession(request);
  const path = request.nextUrl.pathname;

  if (!path.startsWith("/dashboard")) {
    return supabaseResponse;
  }

  // Belum login -> lempar ke halaman login
  if (!user || !profile) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Login tapi buka dashboard role lain -> lempar ke dashboard sesuai role dia
  const segments = path.split("/"); // ["", "dashboard", "mahasiswa", ...]
  const targetRole = segments[2];
  if (targetRole && targetRole !== profile.role) {
    const url = request.nextUrl.clone();
    url.pathname = ROLE_HOME[profile.role] ?? "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
