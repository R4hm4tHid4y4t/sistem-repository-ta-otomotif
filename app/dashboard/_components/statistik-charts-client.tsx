"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DAFTAR_SDGS } from "@/lib/sdgs";

const WARNA_DONUT = ["#22406b", "#EA6A17", "#5c80a8", "#f78d2e", "#8ea7c7", "#c2530f", "#b7c7dd", "#8f3d0c"];

type Sederhana = { nama: string; jumlah: number };

export function StatistikChartsClient({
  lengkap,
  totalTA,
  perTahun,
  perKategori,
  perJenisDoc,
  perKbk,
  perPembimbing,
  perPenguji,
  sdgCount,
}: {
  lengkap: boolean;
  totalTA: number;
  perTahun: { tahun: string; S1: number; D3: number }[];
  perKategori: Sederhana[];
  perJenisDoc: Sederhana[];
  perKbk: Sederhana[];
  perPembimbing: Sederhana[];
  perPenguji: Sederhana[];
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
                <Bar dataKey="D3" stackId="a" fill="#8ea7c7" />
                <Bar dataKey="S1" stackId="a" fill="#22406b" />
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-medium text-primary-800">Distribusi Jenis Dokumen</p>
          {perJenisDoc.length === 0 ? (
            <p className="text-sm text-slate-400">Belum ada data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(160, perJenisDoc.length * 40)}>
              <BarChart data={perJenisDoc} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="nama" fontSize={11} width={130} />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#EA6A17" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-medium text-primary-800">Distribusi per KBK</p>
          {perKbk.length === 0 ? (
            <p className="text-sm text-slate-400">Belum ada data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(160, perKbk.length * 32)}>
              <BarChart data={perKbk} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="nama" fontSize={11} width={150} />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#22406b" radius={[0, 4, 4, 0]} />
              </BarChart>
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
                  <Bar dataKey="jumlah" fill="#f78d2e" radius={[0, 4, 4, 0]} />
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
                  <Bar dataKey="jumlah" fill="#5c80a8" radius={[0, 4, 4, 0]} />
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
            <div key={s.nomor} style={{ backgroundColor: s.warna }} className="rounded-xl p-3 text-white">
              <p className="text-xl font-bold">{sdgCount[s.nomor] ?? 0}</p>
              <p className="text-xs">{s.nomor} {s.nama}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}