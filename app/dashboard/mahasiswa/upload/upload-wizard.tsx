"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadTugasAkhir } from "@/lib/actions/ta";
import { DAFTAR_SDGS } from "@/lib/sdgs";

type Kategori = { id: string; nama_kategori: string };
type Dosen = { id: string; nama_lengkap: string; jabatan: string | null };

const LANGKAH = ["Data TA", "Upload File", "Review & Submit"];

export function UploadWizard({ kategoriList, dosenList }: { kategoriList: Kategori[]; dosenList: Dosen[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [langkah, setLangkah] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [judul, setJudul] = useState("");
  const [abstrak, setAbstrak] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const [prodi, setProdi] = useState("s1_pend_otomotif");
  const [tahun, setTahun] = useState(String(new Date().getFullYear()));
  const [kategoriId, setKategoriId] = useState("");
  const [sdgs, setSdgs] = useState<number[]>([]);
  const [pembimbing1, setPembimbing1] = useState("");
  const [pembimbing2, setPembimbing2] = useState("");
  const [penguji1, setPenguji1] = useState("");
  const [penguji2, setPenguji2] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function toggleSdg(n: number) {
    setSdgs((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  function pilihDosen(field: "pembimbing1" | "pembimbing2" | "penguji1" | "penguji2", value: string) {
    const setters = { pembimbing1: setPembimbing1, pembimbing2: setPembimbing2, penguji1: setPenguji1, penguji2: setPenguji2 };
    const nilaiSekarang = { pembimbing1, pembimbing2, penguji1, penguji2 };
    setters[field](value);
    if (value) {
      (Object.keys(setters) as (keyof typeof setters)[]).forEach((key) => {
        if (key !== field && nilaiSekarang[key] === value) setters[key]("");
      });
    }
  }

  function opsiDosen(kecuali: string) {
    const dipakai = new Set([pembimbing1, pembimbing2, penguji1, penguji2].filter((id) => id && id !== kecuali));
    return dosenList.filter((d) => !dipakai.has(d.id));
  }

  function namaDosen(id: string) {
    return dosenList.find((d) => d.id === id)?.nama_lengkap ?? "-";
  }

  function validasiLangkah1() {
    if (!judul || !abstrak || !kategoriId || !pembimbing1 || !penguji1) {
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
    fd.set("tahun", tahun);
    fd.set("kategori_id", kategoriId);
    fd.set("kata_kunci", kataKunci);
    fd.set("sdgs", sdgs.join(","));
    fd.set("dosen_pembimbing_id", pembimbing1);
    fd.set("dosen_pembimbing_2_id", pembimbing2);
    fd.set("dosen_penguji_1_id", penguji1);
    fd.set("dosen_penguji_2_id", penguji2);
    fd.set("file", file);

    startTransition(async () => {
      try {
        await uploadTugasAkhir(fd);
        router.push("/dashboard/mahasiswa/status?uploaded=1");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengunggah TA.");
      }
    });
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* STEPPER */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        {LANGKAH.map((label, i) => {
          const n = i + 1;
          const aktif = n === langkah;
          const selesai = n < langkah;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  selesai ? "bg-accent-500 text-white" : aktif ? "border-2 border-accent-500 text-accent-600" : "border border-slate-300 text-slate-400"
                }`}
              >
                {selesai ? "✓" : n}
              </span>
              <span className={aktif ? "font-medium text-primary-800" : "text-slate-400"}>{label}</span>
              {n < 3 && <span className="mx-1 h-px flex-1 bg-slate-200" />}
            </div>
          );
        })}
      </div>

      {error && <p className="mb-4 rounded-lg bg-amber-50 p-2 text-sm text-amber-800">{error}</p>}

      {/* STEP 1 */}
      {langkah === 1 && (
        <div className="space-y-4">
          <Field label="Judul Tugas Akhir *">
            <input value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2" />
          </Field>
          <Field label="Abstrak *">
            <textarea value={abstrak} onChange={(e) => setAbstrak(e.target.value)} rows={5} className="w-full rounded border border-slate-300 px-3 py-2" />
          </Field>
          <Field label="Kata Kunci (pisahkan dengan koma)">
            <input value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} placeholder="mis. ESP32, Bluetooth, Sensor" className="w-full rounded border border-slate-300 px-3 py-2" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Program Studi *">
              <select value={prodi} onChange={(e) => setProdi(e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
                <option value="s1_pend_otomotif">S1 Pendidikan Teknik Otomotif</option>
                <option value="d3_otomotif">D3 Teknik Otomotif</option>
              </select>
            </Field>
            <Field label="Tahun *">
              <input type="number" value={tahun} onChange={(e) => setTahun(e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2" />
            </Field>
          </div>
          <Field label="Kategori / Topik *">
            <select value={kategoriId} onChange={(e) => setKategoriId(e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
              <option value="">Pilih kategori</option>
              {kategoriList.map((k) => (
                <option key={k.id} value={k.id}>{k.nama_kategori}</option>
              ))}
            </select>
          </Field>

          <div>
            <p className="mb-2 text-sm font-medium text-primary-800">Tag SDGs (opsional, bisa lebih dari satu)</p>
            <div className="flex flex-wrap gap-2">
              {DAFTAR_SDGS.map((s) => (
                <button
                  key={s.nomor}
                  type="button"
                  onClick={() => toggleSdg(s.nomor)}
                  style={sdgs.includes(s.nomor) ? { backgroundColor: s.warna } : undefined}
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    sdgs.includes(s.nomor) ? "text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {s.nomor} {s.nama}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pembimbing I *">
              <select value={pembimbing1} onChange={(e) => pilihDosen("pembimbing1", e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
                <option value="">Pilih dosen</option>
                {opsiDosen(pembimbing1).map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
              </select>
            </Field>
            <Field label="Pembimbing II (opsional)">
              <select value={pembimbing2} onChange={(e) => pilihDosen("pembimbing2", e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
                <option value="">Pilih dosen</option>
                {opsiDosen(pembimbing2).map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
              </select>
            </Field>
            <Field label="Penguji I *">
              <select value={penguji1} onChange={(e) => pilihDosen("penguji1", e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
                <option value="">Pilih dosen</option>
                {opsiDosen(penguji1).map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
              </select>
            </Field>
            <Field label="Penguji II (opsional)">
              <select value={penguji2} onChange={(e) => pilihDosen("penguji2", e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
                <option value="">Pilih dosen</option>
                {opsiDosen(penguji2).map((d) => <option key={d.id} value={d.id}>{d.nama_lengkap}</option>)}
              </select>
            </Field>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => validasiLangkah1() && setLangkah(2)}
              className="rounded bg-accent-500 px-5 py-2 text-white hover:bg-accent-600"
            >
              Lanjut →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {langkah === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-primary-800">Upload File Dokumen</p>
          <input ref={fileInputRef} type="file" accept="application/pdf" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-10 text-center hover:border-accent-400"
          >
            <span className="text-3xl">📄</span>
            {file ? (
              <>
                <span className="font-medium text-primary-700">{file.name}</span>
                <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</span>
                <span className="text-xs text-accent-600">Ganti file</span>
              </>
            ) : (
              <span className="text-sm text-slate-500">Klik untuk pilih file PDF</span>
            )}
          </button>
          <p className="rounded bg-amber-50 p-3 text-xs text-amber-700">
            Penting: pastikan dokumen PDF yang diunggah sudah final dan memuat halaman pengesahan (TTD pembimbing) di dalamnya.
          </p>
          <div className="flex justify-between">
            <button onClick={() => setLangkah(1)} className="rounded-lg border border-primary-600 px-5 py-2 text-primary-700 hover:bg-primary-50">← Kembali</button>
            <button
              onClick={() => (file ? setLangkah(3) : setError("File PDF wajib diunggah."))}
              className="rounded bg-accent-500 px-5 py-2 text-white hover:bg-accent-600"
            >
              Lanjut →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {langkah === 3 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-primary-800">Review & Konfirmasi</p>
          <div className="space-y-2 rounded border border-slate-200 p-4 text-sm">
            <Row label="Judul" value={judul} />
            <Row label="Kategori" value={kategoriList.find((k) => k.id === kategoriId)?.nama_kategori ?? "-"} />
            <Row label="Pembimbing I" value={namaDosen(pembimbing1)} />
            <Row label="Pembimbing II" value={pembimbing2 ? namaDosen(pembimbing2) : "-"} />
            <Row label="Penguji I" value={namaDosen(penguji1)} />
            <Row label="Penguji II" value={penguji2 ? namaDosen(penguji2) : "-"} />
            <Row label="File" value={file?.name ?? "-"} />
            <Row label="SDGs" value={sdgs.length ? sdgs.join(", ") : "-"} />
          </div>
          <p className="rounded bg-primary-50 p-3 text-sm text-primary-700">
            Dengan menekan "Unggah & Terbitkan", TA Anda akan <strong>langsung tayang di repositori</strong> dan dapat diakses oleh seluruh civitas akademika.
          </p>
          <div className="flex justify-between">
            <button onClick={() => setLangkah(2)} className="rounded-lg border border-primary-600 px-5 py-2 text-primary-700 hover:bg-primary-50">← Kembali</button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="rounded bg-accent-500 px-5 py-2 font-medium text-white hover:bg-accent-600 disabled:opacity-50"
            >
              {isPending ? "Mengunggah..." : "Unggah & Terbitkan ✓"}
            </button>
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