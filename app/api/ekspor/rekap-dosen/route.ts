import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ExcelJS from "exceljs";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: rows } = await supabase
    .from("tugas_akhir")
    .select(
      "judul, tahun, status_verifikasi, dosen_pembimbing_id, dosen_pembimbing_2_id, dosen_penguji_1_id, dosen_penguji_2_id, mahasiswa:profiles!tugas_akhir_mahasiswa_id_fkey(nama_lengkap, nim)"
    )
    .or(
      `dosen_pembimbing_id.eq.${user.id},dosen_pembimbing_2_id.eq.${user.id},dosen_penguji_1_id.eq.${user.id},dosen_penguji_2_id.eq.${user.id}`
    )
    .order("tahun", { ascending: false });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Rekap TA");
  sheet.columns = [
    { header: "Judul", key: "judul", width: 50 },
    { header: "Penulis", key: "penulis", width: 25 },
    { header: "NIM", key: "nim", width: 15 },
    { header: "Tahun", key: "tahun", width: 10 },
    { header: "Peran", key: "peran", width: 22 },
    { header: "Status", key: "status", width: 12 },
  ];
  sheet.getRow(1).font = { bold: true };

  (rows ?? []).forEach((r: any) => {
    const peran: string[] = [];
    if (r.dosen_pembimbing_id === user.id) peran.push("Pembimbing I");
    if (r.dosen_pembimbing_2_id === user.id) peran.push("Pembimbing II");
    if (r.dosen_penguji_1_id === user.id) peran.push("Penguji I");
    if (r.dosen_penguji_2_id === user.id) peran.push("Penguji II");
    sheet.addRow({
      judul: r.judul,
      penulis: r.mahasiswa?.nama_lengkap ?? "-",
      nim: r.mahasiswa?.nim ?? "-",
      tahun: r.tahun,
      peran: peran.join(", "),
      status: r.status_verifikasi === "ditolak" ? "Ditarik" : "Tayang",
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer as any, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="rekap-ta-dosen.xlsx"`,
    },
  });
}