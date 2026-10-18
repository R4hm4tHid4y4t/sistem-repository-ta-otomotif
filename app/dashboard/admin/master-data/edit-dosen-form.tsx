"use client";

import { useState, useTransition } from "react";
import { updateDosen } from "@/lib/actions/master-data";

type Dosen = { id: string; nama_lengkap: string; nidn: string | null; jabatan: string | null; kode_dosen: string | null };

export function EditDosenForm({ dosen, onClose }: { dosen: Dosen; onClose: () => void }) {
  const [nama, setNama] = useState(dosen.nama_lengkap);
  const [nidn, setNidn] = useState(dosen.nidn ?? "");
  const [jabatan, setJabatan] = useState(dosen.jabatan ?? "");
  const [kode, setKode] = useState(dosen.kode_dosen ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await updateDosen(dosen.id, nama, nidn, jabatan, kode);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 rounded bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama lengkap" className="rounded border border-slate-300 px-2 py-1 text-sm" />
        <input value={kode} onChange={(e) => setKode(e.target.value)} placeholder="Kode dosen" className="w-28 rounded border border-slate-300 px-2 py-1 text-sm" />
        <input value={nidn} onChange={(e) => setNidn(e.target.value)} placeholder="NIDN" className="w-32 rounded border border-slate-300 px-2 py-1 text-sm" />
        <input value={jabatan} onChange={(e) => setJabatan(e.target.value)} placeholder="Jabatan (mis. Lektor Kepala)" className="w-48 rounded border border-slate-300 px-2 py-1 text-sm" />
        <button disabled={isPending} className="rounded bg-accent-500 px-3 py-1 text-sm text-white disabled:opacity-50">
          {isPending ? "Menyimpan..." : "Simpan"}
        </button>
        <button type="button" onClick={onClose} className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-600">Batal</button>
      </div>
      {error && <p className="mt-2 text-xs text-amber-700">{error}</p>}
    </form>
  );
}