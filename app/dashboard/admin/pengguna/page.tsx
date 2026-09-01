import { createClient } from "@/lib/supabase/server";
import { RoleSelector } from "./role-selector";

export default async function KelolaPenggunaPage() {
  const supabase = createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, nama_lengkap, email, role, nim, nidn")
    .order("nama_lengkap");

  const jumlah = (role: string) => (users ?? []).filter((u) => u.role === role).length;

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-primary-800">Kelola Pengguna</h1>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatBox label="Mahasiswa terdaftar" value={jumlah("mahasiswa")} />
        <StatBox label="Dosen terdaftar" value={jumlah("dosen")} />
        <StatBox label="Admin terdaftar" value={jumlah("admin")} />
      </div>
      <div className="overflow-x-auto rounded border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Email</th>
              <th className="p-3">NIM/NIDN</th>
              <th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3 font-medium text-primary-800">{u.nama_lengkap || "-"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.nim || u.nidn || "-"}</td>
                <td className="p-3"><RoleSelector userId={u.id} role={u.role} /></td>
              </tr>
            ))}
            {(users ?? []).length === 0 && (
              <tr><td colSpan={4} className="p-3 text-slate-500">Belum ada pengguna.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-2xl font-bold text-primary-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}