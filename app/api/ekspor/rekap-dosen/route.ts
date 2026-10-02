import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ExcelJS from "exceljs";
import { LABEL_JENIS_DOC, type JenisDoc } from "@/lib/klasifikasi";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [{ data: rows }, { data: jurnalRows }] = await Promise.all([
    supabase
      .from("tugas_akhir")
      .select(
        "judul, tahun, status_verifikasi, jenis_doc, dosen_pembimbing_id, dosen_pembimbing_2_id, dosen_penguji_1_id, dosen_penguji_2_id, dosen_penguji_3_id, mahasiswa:profiles!tugas_akhir_mahasiswa_id_fkey(nama_lengkap, nim)"
      )
      .or(
        `dosen_pembimbing_id.eq.${user.id},dosen_pembimbing_2_id.eq.${user.id},dosen_penguji_1_id.eq.${user.id},dosen_penguji_2_id.eq.${user.id},dosen_penguji_3_id.eq.${user.id}`
      )
      .order("tahun", { ascending: false }),
    supabase
      .from("tugas_akhir")
      .select("judul, tahun, status_verifikasi, penulis_jurnal, mahasiswa:profiles!tugas_akhir_mahasiswa_id_fkey(nama_lengkap, nim)")
      .eq("jenis_doc", "jurnal")
      .order("tahun", { ascending: false }),
  ]);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Rekap Dosen");
  sheet.columns = [
    { header: "Judul", key: "judul", width: 50 },
    { header: "Penulis/Mahasiswa", key: "penulis", width: 25 },
    { header: "NIM", key: "nim", width: 15 },
    { header: "Tahun", key: "tahun", width: 10 },
    { header: "Jenis", key: "jenis", width: 18 },
    { header: "Peran", key: "peran", width: 22 },
    { header: "Status", key: "status", width: 12 },
  ];
  sheet.getRow(1).font = { bold: true };

  (rows ?? []).forEach((r: any) => {
    const jenis = r.jenis_doc as JenisDoc;
    const peran: string[] = [];
    if (jenis === "laporan_praktek_industri") {
      if (r.dosen_pembimbing_id === user.id) peran.push("Pembimbing PLI");
    } else {
      if (r.dosen_pembimbing_id === user.id) peran.push("Pembimbing I");
      if (r.dosen_pembimbing_2_id === user.id) peran.push("Pembimbing II");
      if (r.dosen_penguji_1_id === user.id) peran.push("Penguji I");
      if (r.dosen_penguji_2_id === user.id) peran.push("Penguji II");
      if (r.dosen_penguji_3_id === user.id) peran.push("Penguji III");
    }
    sheet.addRow({
      judul: r.judul,
      penulis: r.mahasiswa?.nama_lengkap ?? "-",
      nim: r.mahasiswa?.nim ?? "-",
      tahun: r.tahun,
      jenis: LABEL_JENIS_DOC[jenis] ?? jenis,
      peran: peran.join(", "),
      status: r.status_verifikasi === "ditolak" ? "Ditarik" : "Tayang",
    });
  });

  (jurnalRows ?? []).forEach((r: any) => {
    const daftar: { nama: string; dosen_id?: string | null }[] = r.penulis_jurnal ?? [];
    const posisi = daftar.findIndex((p) => p.dosen_id === user.id);
    if (posisi < 0) return;
    sheet.addRow({
      judul: r.judul,
      penulis: r.mahasiswa?.nama_lengkap ?? "-",
      nim: r.mahasiswa?.nim ?? "-",
      tahun: r.tahun,
      jenis: LABEL_JENIS_DOC.jurnal,
      peran: `Penulis ke-${posisi + 1} dari ${daftar.length}`,
      status: r.status_verifikasi === "ditolak" ? "Ditarik" : "Tayang",
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer as any, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="rekap-dosen.xlsx"`,
    },
  });
}