import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import ExcelJS from "exceljs";
import { terapkanPenulis } from "@/lib/penulis";

type Row = any;
type Kolom = { header: string; width: number; get: (r: Row) => string | number };

const nama = (d: any) => d?.nama_lengkap ?? "";
const tgl = (v?: string | null) => (v ? new Date(v).toLocaleDateString("id-ID") : "");
const prodi = (r: Row) => (r.prodi === "s1_pend_otomotif" ? "S1 Pend. Teknik Otomotif" : "D3 Teknik Otomotif");
const status = (r: Row) => (r.status_verifikasi === "ditolak" ? "Ditarik" : "Tayang");
const gabung = (...v: (string | null | undefined)[]) => v.filter(Boolean).join(", ");

const AWAL: Kolom[] = [
  { header: "Judul", width: 50, get: (r) => r.judul },
  { header: "Penulis", width: 25, get: (r) => nama(r.mahasiswa) },
  { header: "NIM", width: 14, get: (r) => r.mahasiswa?.nim ?? "" },
  { header: "Tahun", width: 8, get: (r) => r.tahun },
  { header: "Program Studi", width: 24, get: prodi },
];
const AKHIR: Kolom[] = [
  { header: "Status", width: 10, get: status },
  { header: "Diunggah", width: 14, get: (r) => tgl(r.created_at) },
];

const SHEETS: Record<string, { nama: string; kolom: Kolom[] }> = {
  ta: {
    nama: "TA-Skripsi",
    kolom: [
      ...AWAL,
      { header: "Bidang Kajian", width: 24, get: (r) => r.kbk ?? "" },
      { header: "Jenis Penelitian", width: 18, get: (r) => (r.bidang === "kependidikan" ? "Kependidikan" : r.bidang === "non_kependidikan" ? "Non-Kependidikan" : "") },
      { header: "Pembimbing I", width: 28, get: (r) => nama(r.pembimbing1) },
      { header: "Pembimbing II", width: 28, get: (r) => nama(r.pembimbing2) },
      { header: "Penguji", width: 50, get: (r) => gabung(nama(r.penguji1), nama(r.penguji2), nama(r.penguji3), nama(r.penguji4), nama(r.penguji5)) },
      { header: "SDGs", width: 14, get: (r) => (r.sdgs ?? []).join(", ") },
      { header: "Kata Kunci", width: 30, get: (r) => (r.kata_kunci ?? []).join(", ") },
      ...AKHIR,
    ],
  },
  jurnal: {
    nama: "Jurnal",
    kolom: [
      { header: "Judul (ID)", width: 50, get: (r) => r.judul },
      { header: "Judul (EN)", width: 40, get: (r) => r.judul_en ?? "" },
      { header: "Nama Jurnal", width: 22, get: (r) => r.nama_jurnal ?? "" },
      { header: "Link Publikasi", width: 36, get: (r) => r.doi_jurnal ?? "" },
      { header: "Tahun", width: 8, get: (r) => r.tahun },
      { header: "Program Studi", width: 24, get: prodi },
      { header: "Bidang Kajian", width: 24, get: (r) => r.kbk ?? "" },
      {
        header: "Daftar Penulis",
        width: 60,
        get: (r) =>
          (r.penulis_jurnal ?? [])
            .map(
              (p: any, i: number) =>
                `${i + 1}. ${p.nama} (${p.peran === "lainnya" ? p.peran_lainnya || "Lainnya" : p.peran === "dosen" ? "Dosen" : "Mahasiswa"})`
            )
            .join("; "),
      },
      { header: "Diunggah oleh", width: 25, get: (r) => nama(r.mahasiswa) },
      { header: "NIM Pengunggah", width: 14, get: (r) => r.mahasiswa?.nim ?? "" },
      { header: "SDGs", width: 14, get: (r) => (r.sdgs ?? []).join(", ") },
      ...AKHIR,
    ],
  },
  laporan_pkl: {
    nama: "PLK",
    kolom: [
      ...AWAL,
      { header: "Nama Sekolah", width: 30, get: (r) => r.nama_perusahaan ?? "" },
      { header: "Alamat Sekolah", width: 40, get: (r) => r.alamat_perusahaan ?? "" },
      { header: "Kepala Sekolah", width: 26, get: (r) => r.nama_kepala_sekolah ?? "" },
      { header: "Guru Pamong", width: 26, get: (r) => r.nama_pembimbing_lapangan ?? "" },
      { header: "Jabatan Guru Pamong", width: 24, get: (r) => r.jabatan_pembimbing_lapangan ?? "" },
      { header: "Dosen Pembimbing", width: 28, get: (r) => nama(r.pembimbing1) },
      { header: "Koordinator PPLK/UPPL", width: 28, get: (r) => nama(r.koordinator) },
      { header: "Tanggal Mulai", width: 14, get: (r) => tgl(r.tanggal_mulai_pli) },
      { header: "Tanggal Selesai", width: 14, get: (r) => tgl(r.tanggal_selesai_pli) },
      { header: "Semester", width: 18, get: (r) => r.semester_pelaksanaan ?? "" },
      ...AKHIR,
    ],
  },
  laporan_ptk: {
    nama: "PTK",
    kolom: [
      ...AWAL,
      { header: "Nama Sekolah", width: 30, get: (r) => r.nama_perusahaan ?? "" },
      { header: "Dosen Pembimbing", width: 28, get: (r) => nama(r.pembimbing1) },
      { header: "Semester", width: 18, get: (r) => r.semester_pelaksanaan ?? "" },
      { header: "Kata Kunci", width: 30, get: (r) => (r.kata_kunci ?? []).join(", ") },
      ...AKHIR,
    ],
  },
  laporan_praktek_industri: {
    nama: "PLI",
    kolom: [
      ...AWAL,
      { header: "Perusahaan/Instansi", width: 30, get: (r) => r.nama_perusahaan ?? "" },
      { header: "Alamat Perusahaan", width: 40, get: (r) => r.alamat_perusahaan ?? "" },
      { header: "Pembimbing Lapangan", width: 26, get: (r) => r.nama_pembimbing_lapangan ?? "" },
      { header: "Jabatan Pembimbing Lapangan", width: 26, get: (r) => r.jabatan_pembimbing_lapangan ?? "" },
      { header: "Dosen Pembimbing", width: 28, get: (r) => nama(r.pembimbing1) },
      { header: "Koordinator PLI", width: 28, get: (r) => nama(r.koordinator) },
      { header: "Tanggal Mulai", width: 14, get: (r) => tgl(r.tanggal_mulai_pli) },
      { header: "Tanggal Selesai", width: 14, get: (r) => tgl(r.tanggal_selesai_pli) },
      { header: "Semester", width: 18, get: (r) => r.semester_pelaksanaan ?? "" },
      ...AKHIR,
    ],
  },
};

SHEETS.prestasi = {
  nama: "Prestasi",
  kolom: [
    { header: "Judul Prestasi", width: 50, get: (r) => r.judul },
    { header: "Nama", width: 25, get: (r) => nama(r.mahasiswa) },
    { header: "NIM", width: 14, get: (r) => r.mahasiswa?.nim ?? "" },
    { header: "Program Studi", width: 24, get: prodi },
    {
      header: "Kategori",
      width: 16,
      get: (r) => (r.kategori_prestasi === "akademik" ? "Akademik" : r.kategori_prestasi === "non_akademik" ? "Non Akademik" : ""),
    },
    {
      header: "Tingkat",
      width: 16,
      get: (r) => (({ internasional: "Internasional", nasional: "Nasional", daerah: "Daerah" }) as Record<string, string>)[r.tingkat_prestasi] ?? "",
    },
    { header: "Tahun", width: 8, get: (r) => r.tahun },
    ...AKHIR,
  ],
};

const SELECT = `
  *,
  kategori_topik(nama_kategori),
  mahasiswa:profiles!tugas_akhir_mahasiswa_id_fkey(nama_lengkap, nim),
  pembimbing1:profiles!tugas_akhir_dosen_pembimbing_id_fkey(nama_lengkap),
  pembimbing2:profiles!tugas_akhir_dosen_pembimbing_2_id_fkey(nama_lengkap),
  penguji1:profiles!tugas_akhir_dosen_penguji_1_id_fkey(nama_lengkap),
  penguji2:profiles!tugas_akhir_dosen_penguji_2_id_fkey(nama_lengkap),
  penguji3:profiles!tugas_akhir_dosen_penguji_3_id_fkey(nama_lengkap),
  penguji4:profiles!tugas_akhir_dosen_penguji_4_id_fkey(nama_lengkap),
  penguji5:profiles!tugas_akhir_dosen_penguji_5_id_fkey(nama_lengkap),
  koordinator:profiles!tugas_akhir_koordinator_pli_id_fkey(nama_lengkap)
`;

function isiSheet(wb: ExcelJS.Workbook, def: { nama: string; kolom: Kolom[] }, rows: Row[]) {
  const ws = wb.addWorksheet(def.nama);
  ws.columns = def.kolom.map((k, i) => ({ header: k.header, key: `k${i}`, width: k.width }));
  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  rows.forEach((r) => {
    const obj: Record<string, string | number> = {};
    def.kolom.forEach((k, i) => (obj[`k${i}`] = k.get(r)));
    ws.addRow(obj);
  });
}

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sp = request.nextUrl.searchParams;
  const jenis = sp.get("jenis") ?? "semua";
  const dari = Number(sp.get("dari"));
  const sampai = Number(sp.get("sampai"));

  if (jenis !== "semua" && !SHEETS[jenis]) {
    return NextResponse.json({ error: "Jenis dokumen tidak dikenal" }, { status: 400 });
  }

  let query = supabase
    .from("tugas_akhir")
    .select(SELECT)
    .order("tahun", { ascending: false })
    .order("created_at", { ascending: false });
  if (jenis !== "semua") query = query.eq("jenis_doc", jenis);
  if (dari) query = query.gte("tahun", dari);
  if (sampai) query = query.lte("tahun", sampai);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = ((data ?? []) as Row[]).map(terapkanPenulis);

  const workbook = new ExcelJS.Workbook();
  if (jenis === "semua") {
    Object.entries(SHEETS).forEach(([kunci, def]) => {
      isiSheet(workbook, def, rows.filter((r) => r.jenis_doc === kunci));
    });
  } else {
    isiSheet(workbook, SHEETS[jenis], rows);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer as any, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="rekap-karya-${jenis}.xlsx"`,
    },
  });
}