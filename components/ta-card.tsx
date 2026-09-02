import Link from "next/link";
import { User } from "lucide-react";
import { getSdg } from "@/lib/sdgs";
import { KATEGORI_META } from "@/lib/kategori-icons";

export function TACard({ ta }: { ta: any }) {
  const isS1 = ta.prodi === "s1_pend_otomotif";
  const CatIcon = KATEGORI_META[ta.kategori_topik?.nama_kategori]?.icon;
  const catColor = KATEGORI_META[ta.kategori_topik?.nama_kategori]?.warna;

  const pembimbing = [ta.pembimbing1?.nama_lengkap, ta.pembimbing2?.nama_lengkap].filter(Boolean).join(" & ");
  const penguji = [ta.penguji1?.nama_lengkap, ta.penguji2?.nama_lengkap].filter(Boolean).join(" & ");

  return (
    <Link
      href={`/ta/${ta.id}`}
      className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)]"
    >
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest ${isS1 ? "bg-primary-50 text-primary-700" : "bg-accent-50 text-accent-700"}`}>
              {isS1 ? "S1" : "D3"}
            </span>
            {ta.kategori_topik && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                {CatIcon && <CatIcon className="h-3.5 w-3.5" style={{ color: catColor }} strokeWidth={2.5} />}
                {ta.kategori_topik.nama_kategori}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-slate-400">{ta.tahun}</span>
        </div>

        <h3 className="mb-3 font-heading text-[15px] font-bold leading-snug text-primary-800 line-clamp-3">
          {ta.judul}
        </h3>

        <div className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <User className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.5} />
          <span>{ta.mahasiswa?.nama_lengkap} · {ta.mahasiswa?.nim}</span>
        </div>

        <div className="space-y-1 text-[11px] leading-relaxed text-slate-500">
          {pembimbing && (
            <p className="line-clamp-1"><span className="font-semibold text-slate-700">Pembimbing:</span> {pembimbing}</p>
          )}
          {penguji && (
            <p className="line-clamp-1"><span className="font-semibold text-slate-700">Penguji:</span> {penguji}</p>
          )}
        </div>
      </div>

      {ta.sdgs?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {ta.sdgs.map((n: number) => {
            const sdg = getSdg(n);
            if (!sdg) return null;
            return (
              <span key={n} style={{ backgroundColor: sdg.warna }} className="rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white shadow-sm">
                SDG {sdg.nomor}
              </span>
            );
          })}
        </div>
      )}
    </Link>
  );
}