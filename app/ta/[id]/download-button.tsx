"use client";
import { useState, useTransition } from "react";
import { getSignedDownloadUrl } from "@/lib/actions/ta";

export function DownloadTAButton({ taId, label = "Unduh PDF Lengkap" }: { taId: string; label?: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        const url = await getSignedDownloadUrl(taId);
        window.open(url, "_blank");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengambil file.");
      }
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="w-full rounded bg-accent-500 px-4 py-2 font-medium text-white hover:bg-accent-600 disabled:opacity-50"
      >
        {isPending ? "Menyiapkan file..." : label}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}