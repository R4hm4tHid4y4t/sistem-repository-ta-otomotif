"use client";

import { useState, useTransition } from "react";
import { updateSdgMaster } from "@/lib/actions/sdgs";

type Sdg = { nomor: number; nama: string; warna: string; deskripsi: string | null };

export function SdgManager({ sdgsList }: { sdgsList: Sdg[] }) {
  const [editNomor, setEditNomor] = useState<number | null>(null);

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {sdgsList.map((s) =>
        editNomor === s.nomor ? (
          <EditRow key={s.nomor} sdg={s} onClose={() => setEditNomor(null)} />
        ) : (
          <li key={s.nomor} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span style={{ backgroundColor: s.warna }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white">
                {s.nomor}
              </span>
              <div>
                <p className="font-medium text-primary-800">{s.nama}</p>
                {s.deskripsi && <p className="text-xs text-slate-500">{s.deskripsi}</p>}
              </div>
            </div>
            <button onClick={() => setEditNomor(s.nomor)} className="text-xs text-accent-600 hover:underline">Edit</button>
          </li>
        )
      )}
    </ul>
  );
}

function EditRow({ sdg, onClose }: { sdg: Sdg; onClose: () => void }) {
  const [nama, setNama] = useState(sdg.nama);
  const [warna, setWarna] = useState(sdg.warna);
  const [deskripsi, setDeskripsi] = useState(sdg.deskripsi ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <li className="rounded-2xl border border-accent-200 bg-accent-50 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span style={{ backgroundColor: warna }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white">
          {sdg.nomor}
        </span>
        <input type="color" value={warna} onChange={(e) => setWarna(e.target.value)} className="h-9 w-9 cursor-pointer rounded border border-slate-300" />
      </div>
      <input value={nama} onChange={(e) => setNama(e.target.value)} className="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
      <input value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi (opsional)" className="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
      <div className="flex gap-2">
        <button
          onClick={() => startTransition(async () => { await updateSdgMaster(sdg.nomor, nama, warna, deskripsi); onClose(); })}
          disabled={isPending}
          className="rounded-lg bg-accent-500 px-3 py-1 text-xs text-white hover:bg-accent-600"
        >
          Simpan
        </button>
        <button onClick={onClose} className="rounded-lg border border-primary-600 px-3 py-1 text-xs text-primary-700 hover:bg-primary-50">Batal</button>
      </div>
    </li>
  );
}