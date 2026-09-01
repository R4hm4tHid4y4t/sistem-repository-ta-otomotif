"use client";

import { useState } from "react";
import { EditDosenForm } from "./edit-dosen-form";

type Dosen = { id: string; nama_lengkap: string; nidn: string | null; jabatan: string | null };

export function DosenRow({ dosen }: { dosen: Dosen }) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="border-t p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-primary-800">{dosen.nama_lengkap || "(nama belum diisi)"}</p>
          <p className="text-xs text-slate-500">
            NIDN: {dosen.nidn || "-"} · {dosen.jabatan || "Jabatan belum diisi"}
          </p>
        </div>
        <button onClick={() => setEditing((v) => !v)} className="text-sm text-accent-600 hover:underline">
          {editing ? "Tutup" : "Edit"}
        </button>
      </div>
      {editing && <EditDosenForm dosen={dosen} onClose={() => setEditing(false)} />}
    </li>
  );
}