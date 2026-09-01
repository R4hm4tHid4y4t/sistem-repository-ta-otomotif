"use client";

import { useState, useTransition } from "react";
import { tambahKategori, updateKategori, hapusKategori } from "@/lib/actions/master-data";

type Kategori = { id: string; nama_kategori: string; deskripsi: string | null };

export function KategoriManager({ kategoriList }: { kategoriList: Kategori[] }) {
  const [namaBaru, setNamaBaru] = useState("");
  const [deskripsiBaru, setDeskripsiBaru] = useState("");
  const [isPending, startTransition] = useTransition();
  const [editId, setEditId] = useState<string | null>(null);

  function handleTambah(e: React.FormEvent) {
    e.preventDefault();
    if (!namaBaru) return;
    startTransition(async () => {
      await tambahKategori(namaBaru, deskripsiBaru);
      setNamaBaru("");
      setDeskripsiBaru("");
    });
  }

  return (
    <div className="space-y-4">
      <ul className="grid gap-3 sm:grid-cols-2">
        {kategoriList.map((k) =>
          editId === k.id ? (
            <EditRow key={k.id} kategori={k} onClose={() => setEditId(null)} />
          ) : (
            <li key={k.id} className="rounded border border-slate-200 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-primary-800">{k.nama_kategori}</p>
                  <p className="text-xs text-slate-500">{k.deskripsi}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => setEditId(k.id)} className="text-accent-600 hover:underline">Edit</button>
                  <button
                    onClick={() => startTransition(() => hapusKategori(k.id))}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </li>
          )
        )}
      </ul>

      <form onSubmit={handleTambah} className="flex flex-wrap items-center gap-2 rounded border border-dashed border-slate-300 p-3">
        <input value={namaBaru} onChange={(e) => setNamaBaru(e.target.value)} placeholder="Nama kategori baru" className="rounded border border-slate-300 px-2 py-1 text-sm" />
        <input value={deskripsiBaru} onChange={(e) => setDeskripsiBaru(e.target.value)} placeholder="Deskripsi singkat" className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm" />
        <button disabled={isPending} className="rounded bg-accent-500 px-3 py-1 text-sm text-white disabled:opacity-50">
          + Tambah Kategori
        </button>
      </form>
    </div>
  );
}

function EditRow({ kategori, onClose }: { kategori: Kategori; onClose: () => void }) {
  const [nama, setNama] = useState(kategori.nama_kategori);
  const [deskripsi, setDeskripsi] = useState(kategori.deskripsi ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <li className="rounded border border-accent-300 bg-accent-50 p-3">
      <input value={nama} onChange={(e) => setNama(e.target.value)} className="mb-2 w-full rounded border border-slate-300 px-2 py-1 text-sm" />
      <input value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="mb-2 w-full rounded border border-slate-300 px-2 py-1 text-sm" />
      <div className="flex gap-2">
        <button
          onClick={() => startTransition(async () => { await updateKategori(kategori.id, nama, deskripsi); onClose(); })}
          disabled={isPending}
          className="rounded bg-accent-500 px-3 py-1 text-xs text-white"
        >
          Simpan
        </button>
        <button onClick={onClose} className="rounded border border-slate-300 px-3 py-1 text-xs">Batal</button>
      </div>
    </li>
  );
}