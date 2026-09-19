"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadTugasAkhir } from "@/lib/actions/ta";
 import type { SdgItem } from "@/lib/sdgs";
import { JENIS_DOC_PER_PRODI, KBK_PER_PRODI, LABEL_JENIS_DOC, type Prodi, type JenisDoc } from "@/lib/klasifikasi";

type Kategori = { id: string; nama_kategori: string };
type Dosen = { id: string; nama_lengkap: string; jabatan: string | null };
type PeranDosen = "pembimbing1" | "pembimbing2" | "penguji1" | "penguji2" | "penguji3";

function opsiSemester() {
  const tahunAkhir = new Date().getFullYear() + 1;
  const tahunAwal = 2015;
  const opts: string[] = [];
  for (let y = tahunAkhir; y >= tahunAwal; y--) {
    opts.push(`Genap ${y}/${y + 1}`);
    opts.push(`Ganjil ${y}/${y + 1}`);
  }
  return opts;
}

export function UploadWizard({ kategoriList, dosenList, sdgsList }: { kategoriList: Kategori[]; dosenList: Dosen[]; sdgsList: SdgItem[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [langkah, setLangkah] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedId, setUploadedId] = useState<string | null>(null);

  const [judul, setJudul] = useState("");
  const [abstrak, setAbstrak] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const [prodi, setProdi] = useState<Prodi>("s1_pend_otomotif");
  const [tahun, setTahun] = useState(String(new Date().getFullYear()));
  const [kategoriId, setKategoriId] = useState("");
  const [kbk, setKbk] = useState("");
  const [jenisDoc, setJenisDoc] = useState<JenisDoc | "">("");
  const [bidang, setBidang] = useState("");
  const [sdgs, setSdgs] = useState<number[]>([]);
  const [pembimbing1, setPembimbing1] = useState("");
  const [pembimbing2, setPembimbing2] = useState("");
  const [penguji1, setPenguji1] = useState("");
  const [penguji2, setPenguji2] = useState("");
  const [penguji3, setPenguji3] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Field bersama PLI & PLK (instansi/sekolah, pembimbing lapangan, waktu)
  const [namaPerusahaan, setNamaPerusahaan] = useState(""); // = "Nama Sekolah" untuk PLK
  const [alamatPerusahaan, setAlamatPerusahaan] = useState(""); // = "Alamat Sekolah" untuk PLK
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState(""); // khusus PLK
  const [namaPembimbingLapangan, setNamaPembimbingLapangan] = useState(""); // = "Nama Guru Pamong" untuk PLK
  const [jabatanPembimbingLapangan, setJabatanPembimbingLapangan] = useState(""); // = "Jabatan Guru Pamong" untuk PLK
  const [koordinatorPliId, setKoordinatorPliId] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [semesterPelaksanaan, setSemesterPelaksanaan] = useState("");

  const isPli = jenisDoc === "laporan_praktek_industri";
  const isPlk = jenisDoc === "laporan_pkl";

  const stepLabels = isPlk
    ? ["Metadata", "Pembimbing & Waktu", "Upload File", "Review & Submit", "Sukses"]
    : ["Data Karya", "Upload File", "Review & Submit"];

  function handleProdiChange(value: string) {
    const p = value as Prodi;
    setProdi(p);
    if (!JENIS_DOC_PER_PRODI[p].includes(jenisDoc as JenisDoc)) setJenisDoc("");
    if (!KBK_PER_PRODI[p].includes(kbk)) setKbk("");
    if (p !== "s1_pend_otomotif") setBidang("");
  }

  function toggleSdg(n: number) {
    setSdgs((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  const setters: Record<PeranDosen, (v: string) => void> = {
    pembimbing1: setPembimbing1,
    pembimbing2: setPembimbing2,
    penguji1: setPenguji1,
    penguji2: setPenguji2,
    penguji3: setPenguji3,
  };

  function pilihDosen(field: PeranDosen, value: string) {
    const nilaiSekarang: Record<PeranDosen, string> = { pembimbing1, pembimbing2, penguji1, penguji2, penguji3 };
    setters[field](value);
    if (value) {
      (Object.keys(setters) as PeranDosen[]).forEach((key) => {
        if (key !== field && nilaiSekarang[key] === value) setters[key]("");
      });
    }
  }

  function opsiDosen(kecuali: string) {
    const dipakai = new Set([pembimbing1, pembimbing2, penguji1, penguji2, penguji3].filter((id) => id && id !== kecuali));
    return dosenList.filter((d) => !dipakai.has(d.id));
  }

  function namaDosen(id: string) {
    return dosenList.find((d) => d.id === id)?.nama_lengkap ?? "-";
  }

  function handleFileSelected(selected: File | null) {
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Hanya file berformat PDF yang diperbolehkan.");
      return;
    }
    setError(null);
    setFile(selected);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileSelected(dropped);
  }

  function validasiMetadataStandar() {
    if (!jenisDoc) {
      setError("Pilih Jenis Dokumen dulu.");
      return false;
    }
    if (isPli) {
      if (!judul || !namaPerusahaan || !alamatPerusahaan || !namaPembimbingLapangan || !jabatanPembimbingLapangan || !pembimbing1 || !tanggalMulai || !tanggalSelesai || !semesterPelaksanaan || !abstrak) {
        setError("Lengkapi semua field bertanda * dulu ya.");
        return false;
      }
      setError(null);
      return true;
    }
    if (!judul || !abstrak || !kategoriId || !kbk || !pembimbing1 || !penguji1) {
      setError("Lengkapi semua field bertanda * dulu ya.");
      return false;
    }
    if (prodi === "s1_pend_otomotif" && !bidang) {
      setError("Pilih Bidang (Kependidikan/Non-Kependidikan) dulu.");
      return false;
    }
    setError(null);
    return true;
  }

  function validasiMetadataPlk() {
    if (!jenisDoc) {
      setError("Pilih Jenis Dokumen dulu.");
      return false;
    }
    if (!judul || !namaPerusahaan || !alamatPerusahaan || !namaKepalaSekolah || !namaPembimbingLapangan || !jabatanPembimbingLapangan) {
      setError("Lengkapi semua field bertanda * dulu ya.");
      return false;
    }
    setError(null);
    return true;
  }

  function validasiPembimbingWaktuPlk() {
    if (!tanggalMulai || !tanggalSelesai || !semesterPelaksanaan || !abstrak) {
      setError("Lengkapi semua field bertanda * dulu ya.");
      return false;
    }
    setError(null);
    return true;
  }

  function handleSubmit() {
    if (!file) return setError("File PDF wajib diunggah.");
    setError(null);

    const fd = new FormData();
    fd.set("judul", judul);
    fd.set("abstrak", abstrak);
    fd.set("prodi", prodi);
    fd.set("jenis_doc", jenisDoc);
    fd.set("dosen_pembimbing_id", pembimbing1);
    fd.set("file", file);

    if (isPlk) {
      fd.set("nama_perusahaan", namaPerusahaan);
      fd.set("alamat_perusahaan", alamatPerusahaan);
      fd.set("nama_kepala_sekolah", namaKepalaSekolah);
      fd.set("nama_pembimbing_lapangan", namaPembimbingLapangan);
      fd.set("jabatan_pembimbing_lapangan", jabatanPembimbingLapangan);
      fd.set("koordinator_pli_id", koordinatorPliId);
      fd.set("tanggal_mulai_pli", tanggalMulai);
      fd.set("tanggal_selesai_pli", tanggalSelesai);
      fd.set("semester_pelaksanaan", semesterPelaksanaan);
      fd.set("tahun", String(new Date(tanggalSelesai).getFullYear()));
    } else if (isPli) {
      fd.set("nama_perusahaan", namaPerusahaan);
      fd.set("alamat_perusahaan", alamatPerusahaan);
      fd.set("nama_pembimbing_lapangan", namaPembimbingLapangan);
      fd.set("jabatan_pembimbing_lapangan", jabatanPembimbingLapangan);
      fd.set("koordinator_pli_id", koordinatorPliId);
      fd.set("tanggal_mulai_pli", tanggalMulai);
      fd.set("tanggal_selesai_pli", tanggalSelesai);
      fd.set("semester_pelaksanaan", semesterPelaksanaan);
      fd.set("tahun", String(new Date(tanggalSelesai).getFullYear()));
    } else {
      fd.set("tahun", tahun);
      fd.set("kategori_id", kategoriId);
      fd.set("kata_kunci", kataKunci);
      fd.set("sdgs", sdgs.join(","));
      fd.set("kbk", kbk);
      fd.set("bidang", bidang);
      fd.set("dosen_pembimbing_2_id", pembimbing2);
      fd.set("dosen_penguji_1_id", penguji1);
      fd.set("dosen_penguji_2_id", penguji2);
      fd.set("dosen_penguji_3_id", penguji3);
    }

    startTransition(async () => {
      try {
        const hasil = await uploadTugasAkhir(fd);
        if (isPlk) {
          router.push(`/dashboard/mahasiswa/upload/berhasil${hasil?.id ? `?id=${hasil.id}` : ""}`);
        } else {
          router.push("/dashboard/mahasiswa/status?uploaded=1");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengunggah karya.");
      }
    });
  }

  function renderUploadStep(nomorSebelum: number, nomorSesudah: number) {
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-primary-800">Upload File Dokumen</p>
        <input ref={fileInputRef} type="file" accept="application/pdf" hidden onChange={(e) => handleFileSelected(e.target.files?.[0] ?? null)} />
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed py-10 text-center transition-colors ${
            dragActive ? "border-accent-500 bg-accent-50" : "border-slate-300 hover:border-accent-400"
          }`}
        >
          <span className="text-3xl">📄</span>
          {file ? (
            <>
              <span className="font-medium text-primary-700">{file.name}</span>
              <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</span>
              <span className="text-xs text-accent-600">Ganti file</span>
            </>
          ) : (
            <span className="text-sm text-slate-500">Drag & drop file PDF ke sini, atau klik untuk memilih</span>
          )}
        </div>
        <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Penting: pastikan dokumen PDF yang diunggah sudah final dan memuat halaman pengesahan (TTD) di dalamnya. Hanya file berformat PDF yang diterima.
        </p>
        <div className="flex justify-between">
          <button onClick={() => setLangkah(nomorSebelum)} className="rounded-lg border border-primary-600 px-5 py-2 text-primary-700 hover:bg-primary-50">← Kembali</button>
          <button
            onClick={() => (file ? setLangkah(nomorSesudah) : setError("File PDF wajib diunggah."))}
            className="rounded-lg bg-accent-500 px-5 py-2 text-white hover:bg-accent-600"
          >
            Lanjut →
          </button>
        </div>
      </div>
    );
  }

  function renderReviewStep(nomorSebelum: number) {
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-primary-800">Review & Konfirmasi</p>
        <div className="space-y-2 rounded-xl border border-slate-200 p-4 text-sm">
          <Row label="Jenis Dokumen" value={jenisDoc ? LABEL_JENIS_DOC[jenisDoc as JenisDoc] : "-"} />
          {isPlk ? (
            <>
              <Row label="Judul Laporan PLK" value={judul} />
              <Row label="Nama Sekolah" value={namaPerusahaan} />
              <Row label="Alamat Sekolah" value={alamatPerusahaan} />
              <Row label="Kepala Sekolah" value={namaKepalaSekolah} />
              <Row label="Guru Pamong" value={`${namaPembimbingLapangan} — ${jabatanPembimbingLapangan}`} />
              <Row label="Koordinator PPLK/UPPL" value={koordinatorPliId ? namaDosen(koordinatorPliId) : "-"} />
              <Row label="Periode" value={`${tanggalMulai || "-"} s.d. ${tanggalSelesai || "-"}`} />
              <Row label="Semester Pelaksanaan" value={semesterPelaksanaan || "-"} />
            </>
          ) : isPli ? (
            <>
              <Row label="Judul Laporan PLI" value={judul} />
              <Row label="Perusahaan/Instansi" value={namaPerusahaan} />
              <Row label="Alamat Perusahaan" value={alamatPerusahaan} />
              <Row label="Pembimbing Lapangan" value={`${namaPembimbingLapangan} — ${jabatanPembimbingLapangan}`} />
              <Row label="Dosen Pembimbing PLI" value={namaDosen(pembimbing1)} />
              <Row label="Koordinator PLI" value={koordinatorPliId ? namaDosen(koordinatorPliId) : "-"} />
              <Row label="Periode" value={`${tanggalMulai || "-"} s.d. ${tanggalSelesai || "-"}`} />
              <Row label="Semester Pelaksanaan" value={semesterPelaksanaan || "-"} />
            </>
          ) : (
            <>
              <Row label="Judul" value={judul} />
              <Row label="Kategori" value={kategoriList.find((k) => k.id === kategoriId)?.nama_kategori ?? "-"} />
              <Row label="Pembimbing I" value={namaDosen(pembimbing1)} />
              <Row label="Pembimbing II" value={pembimbing2 ? namaDosen(pembimbing2) : "-"} />
              <Row label="Penguji I" value={namaDosen(penguji1)} />
              <Row label="Penguji II" value={penguji2 ? namaDosen(penguji2) : "-"} />
              <Row label="Penguji III" value={penguji3 ? namaDosen(penguji3) : "-"} />
              <Row label="SDGs" value={sdgs.length ? sdgs.join(", ") : "-"} />
            </>
          )}
          <Row label="File" value={file?.name ?? "-"} />
        </div>
        <p className="rounded-lg bg-primary-50 p-3 text-sm text-primary-700">
          Dengan menekan "Unggah & Terbitkan", karya Anda akan <strong>langsung tayang di repositori</strong> dan dapat diakses oleh seluruh civitas akademika.
        </p>
        <div className="flex justify-between">
          <button onClick={() => setLangkah(nomorSebelum)} className="rounded-lg border border-primary-600 px-5 py-2 text-primary-700 hover:bg-primary-50">← Kembali</button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-lg bg-accent-500 px-5 py-2 font-medium text-white hover:bg-accent-600 disabled:opacity-50"
          >
            {isPending ? "Mengunggah..." : "Unggah & Terbitkan ✓"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2 text-sm">
        {stepLabels.map((label, i) => {
          const n = i + 1;
          const aktif = n === langkah;
          const selesai = n < langkah;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  selesai ? "bg-accent-500 text-white" : aktif ? "border-2 border-accent-500 text-accent-600" : "border border-slate-300 text-slate-400"
                }`}
              >
                {selesai ? "✓" : n}
              </span>
              <span className={`whitespace-nowrap ${aktif ? "font-medium text-primary-800" : "text-slate-400"}`}>{label}</span>
              {n < stepLabels.length && <span className="mx-1 h-px flex-1 bg-slate-200" />}
            </div>
          );
        })}
      </div>

      {error && <p className="mb-4 rounded-lg bg-amber-50 p-2 text-sm text-amber-800">{error}</p>}

      {/* LANGKAH 1: Metadata / Data Karya (semua jenis) */}
      {langkah === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-heading font-semibold text-primary-800">{stepLabels[0]}</h2>
            {jenisDoc && (
              <p className="text-sm text-slate-500">
                Isi metadata untuk <span className="font-medium">{LABEL_JENIS_DOC[jenisDoc as JenisDoc]}</span>
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Program Studi *">
              <select value={prodi} onChange={(e) => handleProdiChange(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="s1_pend_otomotif">S1 Pendidikan Teknik Otomotif</option>
                <option value="d3_otomotif">D3 Teknik Otomotif</option>
              </select>
            </Field>
            <Field label="Jenis Dokumen *">
              <select value={jenisDoc} onChange={(e) => setJenisDoc(e.target.value as JenisDoc)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="">Pilih jenis dokumen</option>
                {JENIS_DOC_PER_PRODI[prodi].map((j) => (
                  <option key={j} value={j}>{LABEL_JENIS_DOC[j]}</option>
                ))}
              </select>
            </Field>
          </div>

          {isPlk && (
            <>
              <div className="rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm">
                <p className="font-medium text-primary-800">Laporan Praktik Lapangan Kependidikan (PLK)</p>
                <p className="mt-1 text-primary-700">Isi metadata sesuai isi laporan PPLK Anda (Bab I dan halaman pengesahan).</p>
              </div>

              <Field label="Judul Laporan PLK *">
                <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder='contoh: "Laporan Pelaksanaan PPLK di SMK Negeri 1 Padang"' className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </Field>

              <Field label="Nama Sekolah *">
                <input value={namaPerusahaan} onChange={(e) => setNamaPerusahaan(e.target.value)} placeholder='contoh: "SMK Negeri 1 Padang"' className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </Field>

              <Field label="Alamat Sekolah *">
                <textarea
                  value={alamatPerusahaan}
                  onChange={(e) => setAlamatPerusahaan(e.target.value)}
                  rows={2}
                  placeholder="Jl. ..., Kel. ..., Kec. ..., Kota, Kode Pos"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                <p className="mt-1 text-xs text-slate-500">Sertakan kelurahan, kecamatan, dan kode pos.</p>
              </Field>

              <Field label="Nama Kepala Sekolah *">
                <input value={namaKepalaSekolah} onChange={(e) => setNamaKepalaSekolah(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama Guru Pamong *">
                  <input value={namaPembimbingLapangan} onChange={(e) => setNamaPembimbingLapangan(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </Field>
                <Field label="Jabatan Guru Pamong *">
                  <input value={jabatanPembimbingLapangan} onChange={(e) => setJabatanPembimbingLapangan(e.target.value)} placeholder='contoh: "Guru Produktif TKR"' className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </Field>
              </div>
            </>
          )}

          {isPli && (
            <>
              <div className="rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm">
                <p className="font-medium text-primary-800">Laporan Praktik Lapangan Industri (PLI)</p>
                <p className="mt-1 text-primary-700">
                  Isi metadata sesuai data yang tertera pada Halaman Pengesahan Fakultas dan Halaman Pengesahan Perusahaan di laporan Anda.
                </p>
              </div>

              <Field label="Judul Laporan PLI *">
                <input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder='contoh: "Pelaksanaan Servis Berkala pada Mitsubishi Xpander"' className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama Perusahaan/Instansi *">
                  <input value={namaPerusahaan} onChange={(e) => setNamaPerusahaan(e.target.value)} placeholder='contoh: "PT. Suka Fajar Khatib Sulaiman"' className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </Field>
                <Field label="Alamat Perusahaan *">
                  <input value={alamatPerusahaan} onChange={(e) => setAlamatPerusahaan(e.target.value)} placeholder='contoh: "Jl. Khatib Sulaiman, Padang"' className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </Field>
              </div>

              <div className="rounded-xl border border-accent-100 bg-accent-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-700">Pembimbing dari Perusahaan</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nama Pembimbing Lapangan *">
                    <input value={namaPembimbingLapangan} onChange={(e) => setNamaPembimbingLapangan(e.target.value)} placeholder='contoh: "Fauzan"' className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </Field>
                  <Field label="Jabatan Pembimbing Lapangan *">
                    <input value={jabatanPembimbingLapangan} onChange={(e) => setJabatanPembimbingLapangan(e.target.value)} placeholder='contoh: "Kepala Bengkel"' className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                  </Field>
                </div>
                <p className="mt-1 text-xs text-slate-500">Sesuai Halaman Pengesahan Perusahaan.</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Pembimbing dari Fakultas</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Dosen Pembimbing PLI *">
                    <select value={pembimbing1} onChange={(e) => pilihDosen("pembimbing1", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                      <option value="">Pilih dosen pembimbing...</option>
                      {dosenList.filter((d) => d.id !== koordinatorPliId).map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
                    </select>
                    <p className="mt-1 text-xs text-slate-500">Sesuai Halaman Pengesahan Fakultas.</p>
                  </Field>
                  <Field label="Koordinator PLI (opsional)">
                    <select value={koordinatorPliId} onChange={(e) => setKoordinatorPliId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                      <option value="">Tidak diisi / tidak tersedia</option>
                      {dosenList.filter((d) => d.id !== pembimbing1).map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Tanggal Mulai *">
                  <input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </Field>
                <Field label="Tanggal Selesai *">
                  <input type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
                </Field>
                <Field label="Semester Pelaksanaan *">
                  <select value={semesterPelaksanaan} onChange={(e) => setSemesterPelaksanaan(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Pilih semester...</option>
                    {opsiSemester().map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Ringkasan Kegiatan PLI *">
                <textarea
                  value={abstrak}
                  onChange={(e) => setAbstrak(e.target.value)}
                  rows={5}
                  placeholder="Uraikan secara singkat kegiatan yang dilakukan selama PLI: apa yang dipelajari, pekerjaan utama yang dikerjakan, dan hasil/manfaat yang diperoleh..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                <p className="mt-1 text-xs text-slate-500">Ringkasan ini ditampilkan sebagai abstrak laporan di halaman repository.</p>
              </Field>
            </>
          )}

          {jenisDoc && !isPli && !isPlk && (
            <>
              {false && <p />}
              <Field label="Judul *">
                <input value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </Field>
              <Field label="Abstrak *">
                <textarea value={abstrak} onChange={(e) => setAbstrak(e.target.value)} rows={5} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </Field>
              <Field label="Kata Kunci (pisahkan dengan koma)">
                <input value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} placeholder="mis. ESP32, Bluetooth, Sensor" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </Field>
              <Field label="Tahun *">
                <input type="number" value={tahun} onChange={(e) => setTahun(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </Field>
              <Field label="Kategori / Topik *">
                <select value={kategoriId} onChange={(e) => setKategoriId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                  <option value="">Pilih kategori</option>
                  {kategoriList.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                  ))}
                </select>
              </Field>
              <Field label="KBK (Kelompok Bidang Kajian) *">
                <select value={kbk} onChange={(e) => setKbk(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                  <option value="">Pilih KBK</option>
                  {KBK_PER_PRODI[prodi].map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </Field>

              {prodi === "s1_pend_otomotif" && (
                <Field label="Bidang *">
                  <div className="flex gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="bidang" checked={bidang === "kependidikan"} onChange={() => setBidang("kependidikan")} />
                      Kependidikan
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="bidang" checked={bidang === "non_kependidikan"} onChange={() => setBidang("non_kependidikan")} />
                      Non-Kependidikan
                    </label>
                  </div>
                </Field>
              )}

              <div>
                <p className="mb-2 text-sm font-medium text-primary-800">Tag SDGs (opsional, bisa lebih dari satu)</p>
                <div className="flex flex-wrap gap-2">
                  {sdgsList.map((s) => (
                    <button
                      key={s.nomor}
                      type="button"
                      onClick={() => toggleSdg(s.nomor)}
                      style={sdgs.includes(s.nomor) ? { backgroundColor: s.warna } : undefined}
                      className={`rounded px-2 py-1 text-xs font-medium ${sdgs.includes(s.nomor) ? "text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      {s.nomor} {s.nama}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Pembimbing I *">
                  <select value={pembimbing1} onChange={(e) => pilihDosen("pembimbing1", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Pilih dosen</option>
                    {opsiDosen(pembimbing1).map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
                  </select>
                </Field>
                <Field label="Pembimbing II (opsional)">
                  <select value={pembimbing2} onChange={(e) => pilihDosen("pembimbing2", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Pilih dosen</option>
                    {opsiDosen(pembimbing2).map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
                  </select>
                </Field>
                <Field label="Penguji I *">
                  <select value={penguji1} onChange={(e) => pilihDosen("penguji1", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Pilih dosen</option>
                    {opsiDosen(penguji1).map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
                  </select>
                </Field>
                <Field label="Penguji II (opsional)">
                  <select value={penguji2} onChange={(e) => pilihDosen("penguji2", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Pilih dosen</option>
                    {opsiDosen(penguji2).map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
                  </select>
                </Field>
                <Field label="Penguji III (opsional)">
                  <select value={penguji3} onChange={(e) => pilihDosen("penguji3", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Pilih dosen</option>
                    {opsiDosen(penguji3).map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
                  </select>
                </Field>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => {
                const ok = isPlk ? validasiMetadataPlk() : validasiMetadataStandar();
                if (ok) setLangkah(2);
              }}
              className="rounded-lg bg-accent-500 px-5 py-2 text-white hover:bg-accent-600"
            >
              Lanjut →
            </button>
          </div>
        </div>
      )}

      {/* LANGKAH 2 */}
      {langkah === 2 && isPlk && (
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-semibold text-primary-800">Pembimbing & Waktu</h2>
          <Field label="Koordinator PPLK/UPPL (opsional)">
            <select value={koordinatorPliId} onChange={(e) => setKoordinatorPliId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="">Tidak diisi / tidak tersedia</option>
              {dosenList.map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Tanggal Mulai *">
              <input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </Field>
            <Field label="Tanggal Selesai *">
              <input type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </Field>
            <Field label="Semester Pelaksanaan *">
              <select value={semesterPelaksanaan} onChange={(e) => setSemesterPelaksanaan(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="">Pilih semester...</option>
                {opsiSemester().map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Ringkasan Kegiatan PPLK *">
            <textarea
              value={abstrak}
              onChange={(e) => setAbstrak(e.target.value)}
              rows={5}
              placeholder="Uraikan kegiatan PPLK sesuai isi Bab II dan III laporan Anda: observasi sekolah, praktik mengajar, dan hasil/refleksi yang diperoleh..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <div className="flex justify-between">
            <button onClick={() => setLangkah(1)} className="rounded-lg border border-primary-600 px-5 py-2 text-primary-700 hover:bg-primary-50">← Kembali</button>
            <button onClick={() => validasiPembimbingWaktuPlk() && setLangkah(3)} className="rounded-lg bg-accent-500 px-5 py-2 text-white hover:bg-accent-600">Lanjut →</button>
          </div>
        </div>
      )}
      {langkah === 2 && !isPlk && renderUploadStep(1, 3)}

      {/* LANGKAH 3 */}
      {langkah === 3 && isPlk && renderUploadStep(2, 4)}
      {langkah === 3 && !isPlk && renderReviewStep(2)}

      {/* LANGKAH 4 (khusus PLK) */}
      {langkah === 4 && isPlk && renderReviewStep(3)}

      {/* LANGKAH 5: Sukses (khusus PLK) */}
      {langkah === 5 && isPlk && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">✓</span>
          <p className="text-lg font-heading font-semibold text-primary-800">Laporan PLK Berhasil Diunggah</p>
          <p className="max-w-sm text-sm text-slate-500">Laporan Anda sudah tayang di repositori dan dapat diakses oleh seluruh civitas akademika.</p>
          <div className="mt-4 flex gap-3">
            {uploadedId && (
              <a href={`/ta/${uploadedId}`} className="rounded-lg border border-primary-600 px-5 py-2 text-primary-700 hover:bg-primary-50">Lihat Laporan</a>
            )}
            <a href="/dashboard/mahasiswa/status" className="rounded-lg bg-accent-500 px-5 py-2 font-medium text-white hover:bg-accent-600">Kembali ke Karya Saya</a>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-primary-800">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <span className="text-slate-400">{label}</span>
      <span className="col-span-2 font-medium text-slate-700">{value}</span>
    </div>
  );
}