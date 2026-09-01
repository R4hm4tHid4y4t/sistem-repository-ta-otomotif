"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/lib/actions/admin";

export function RoleSelector({ userId, role }: { userId: string; role: string }) {
  const [value, setValue] = useState(role);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as "mahasiswa" | "dosen" | "admin";
    setValue(newRole);
    startTransition(() => {
      updateUserRole(userId, newRole);
    });
  }

  return (
    <select value={value} onChange={handleChange} disabled={isPending} className="rounded border border-slate-300 px-2 py-1 text-xs">
      <option value="mahasiswa">Mahasiswa</option>
      <option value="dosen">Dosen</option>
      <option value="admin">Admin</option>
    </select>
  );
}