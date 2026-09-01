"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DAFTAR_SDGS } from "@/lib/sdgs";

const WARNA_DONUT = ["#22406d", "#f5730f", "#4f72a8", "#ffa666", "#7f9cc9", "#d75e08", "#b0c2e0", "#8f3a08"];

export function StatistikChartsClient({
  lengkap,
  totalTA,
  perTahun,
  perKategori,
  perPembimbing,
  perPenguji,
  sdgCount,
}: {
  lengkap: boolean;
  totalTA: number;
  perTahun: { tahun: string; S1: number; D3: number }[];
  perKategori: { nama: string; jumlah: number }[];
  perPembimbing: { nama: string; jumlah: number }[];
  perPenguji: { nama: string; jumlah: number }[];
  sdgCount: Record<number, number>;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-medium text-primary-800">Jumlah TA per Tahun & Program Studi</p>
          {totalTA === 0 ? (
            <p className="text-sm text-slate-400">Belum ada data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={perTahun}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tahun" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="D3" stackId="a" fill="#7f9cc9" />
                <Bar dataKey="S1" stackId="a" fill="#22406d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-medium text-primary-800">Distribusi per Kategori / Topik</p>
          {perKategori.length === 0 ? (
            <p className="text-sm text-slate-400">Belum ada data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={perKategori} dataKey="jumlah" nameKey="nama" innerRadius={50} outerRadius={80}>
                  {perKategori.map((_, i) => (
                    <Cell key={i} fill={WARNA_DONUT[i % WARNA_DONUT.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {lengkap && (
        <>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-medium text-primary-800">Jumlah TA Dibimbing per Dosen Pembimbing</p>
            {perPembimbing.length === 0 ? (
              <p className="text-sm text-slate-400">Belum ada data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(160, perPembimbing.length * 32)}>
                <BarChart data={perPembimbing} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="nama" fontSize={11} width={140} />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#f5730f" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-medium text-primary-800">Jumlah TA Diuji per Dosen Penguji</p>
            {perPenguji.length === 0 ? (
              <p className="text-sm text-slate-400">Belum ada data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(160, perPenguji.length * 32)}>
                <BarChart data={perPenguji} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="nama" fontSize={11} width={140} />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#22406d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-medium text-primary-800">Kontribusi TA terhadap SDGs</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DAFTAR_SDGS.map((s) => (
            <div key={s.nomor} style={{ backgroundColor: s.warna }} className="rounded p-3 text-white">
              <p className="text-xl font-bold">{sdgCount[s.nomor] ?? 0}</p>
              <p className="text-xs">{s.nomor} {s.nama}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}