"use client";

import { useState, useTransition } from "react";
import { tambahDosen } from "@/lib/actions/master-data";

export function TambahDosenForm() {
  const [buka, setBuka] = useState(false);
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [nidn, setNidn] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sukses, setSukses] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSukses(null);
    startTransition(async () => {
      const hasil = await tambahDosen({ nama_lengkap: nama, kode_dosen: kode, nidn, jabatan });
      if (hasil.error) {
        setError(hasil.error);
        return;
      }
      setSukses(`${nama.trim()} berhasil ditambahkan.`);
      setNama("");
      setKode("");
      setNidn("");
      setJabatan("");
    });
  }

  return (
    <div className="mb-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-medium text-primary-800">Tambah Dosen</p>
        <button onClick={() => setBuka((v) => !v)} className="text-sm text-accent-600 hover:underline">
          {buka ? "Tutup" : "+ Tambah"}
        </button>
      </div>

      {buka && (
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
            Dosen yang ditambahkan di sini <strong>tidak punya akun login</strong> (cocok untuk dosen luar, alumni, atau pensiun)
            dan langsung bisa dipilih sebagai pembimbing/penguji. Dosen aktif yang perlu login: buat akunnya dulu di
            Authentication → Users.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama lengkap + gelar *" className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2" />
            <input value={kode} onChange={(e) => setKode(e.target.value)} placeholder="Kode dosen" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input value={nidn} onChange={(e) => setNidn(e.target.value)} placeholder="NIDN" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input value={jabatan} onChange={(e) => setJabatan(e.target.value)} placeholder="Jabatan (mis. Lektor Kepala)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2" />
          </div>
          {error && <p className="rounded-lg bg-amber-50 p-2 text-sm text-amber-800">{error}</p>}
          {sukses && <p className="rounded-lg bg-green-50 p-2 text-sm text-green-700">{sukses}</p>}
          <button disabled={isPending} className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600 disabled:opacity-50">
            {isPending ? "Menyimpan..." : "Simpan Dosen"}
          </button>
        </form>
      )}
    </div>
  );
}