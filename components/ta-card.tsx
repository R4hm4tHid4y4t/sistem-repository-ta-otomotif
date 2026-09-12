import { User, Cog } from "lucide-react";
import { KATEGORI_META } from "@/lib/kategori-icons";
import { cariSdg, type SdgItem } from "@/lib/sdgs";
import { LABEL_JENIS_DOC, LABEL_BIDANG, type JenisDoc, type Bidang } from "@/lib/klasifikasi";

type Dosen = { nama_lengkap: string } | null;

export type TACardData = {
  id: string;
  judul: string;
  tahun: number;
  prodi: string;
  sdgs: number[];
  kbk?: string | null;
  jenis_doc?: JenisDoc;
  bidang?: Bidang | null;
  kategori_topik?: { nama_kategori: string } | null;
  mahasiswa?: { nama_lengkap: string; nim: string | null } | null;
  pembimbing1?: Dosen;
  pembimbing2?: Dosen;
  penguji1?: Dosen;
  penguji2?: Dosen;
  penguji3?: Dosen;
};

export function TACard({ ta, sdgsList }: { ta: TACardData; sdgsList: SdgItem[] }) {
  const meta = ta.kategori_topik ? KATEGORI_META[ta.kategori_topik.nama_kategori] : undefined;
  const Icon = meta?.icon ?? Cog;

  const pembimbingNames = [ta.pembimbing1?.nama_lengkap, ta.pembimbing2?.nama_lengkap].filter(Boolean).join(" & ");
  const pengujiNames = [ta.penguji1?.nama_lengkap, ta.penguji2?.nama_lengkap, ta.penguji3?.nama_lengkap].filter(Boolean).join(" & ");

  return (
    <a href={`/ta/${ta.id}`} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${ta.prodi === "s1_pend_otomotif" ? "bg-primary-100 text-primary-700" : "bg-accent-100 text-accent-700"}`}>
            {ta.prodi === "s1_pend_otomotif" ? "S1" : "D3"}
          </span>
          {ta.jenis_doc && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
              {LABEL_JENIS_DOC[ta.jenis_doc]}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Icon className="h-3.5 w-3.5" style={{ color: meta?.warna ?? "#64748B" }} strokeWidth={1.75} />
            {ta.kategori_topik?.nama_kategori ?? "Umum"}
          </span>
        </div>
        <span className="shrink-0 text-xs text-slate-400">{ta.tahun}</span>
      </div>

      {(ta.kbk || ta.bidang) && (
        <p className="mb-1 text-xs text-slate-400">
          {ta.kbk}
          {ta.kbk && ta.bidang ? " · " : ""}
          {ta.bidang && LABEL_BIDANG[ta.bidang]}
        </p>
      )}

      <p className="mt-1 font-heading font-medium leading-snug text-primary-800">{ta.judul}</p>

      <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
        <User className="h-3 w-3" strokeWidth={1.75} />
        {ta.mahasiswa?.nama_lengkap} {ta.mahasiswa?.nim ? `· ${ta.mahasiswa.nim}` : ""}
      </p>
      {pembimbingNames && <p className="text-xs text-slate-500">Pemb: {pembimbingNames}</p>}
      {pengujiNames && <p className="text-xs text-slate-500">Penguji: {pengujiNames}</p>}

      {ta.sdgs?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {ta.sdgs.map((n) => {
            const sdg = cariSdg(sdgsList, n);
            if (!sdg) return null;
            return (
              <span key={n} style={{ backgroundColor: sdg.warna }} className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white">
                SDG {sdg.nomor}
              </span>
            );
          })}
        </div>
      )}
    </a>
  );
}