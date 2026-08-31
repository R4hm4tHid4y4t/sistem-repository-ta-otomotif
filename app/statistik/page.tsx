import { StatistikCharts } from "@/app/dashboard/_components/statistik-charts";

export default function StatistikPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-semibold text-primary-800">Dashboard Statistik</h1>
      <p className="mb-6 text-sm text-slate-500">Rekap dan analitik koleksi Tugas Akhir Jurusan Teknik Otomotif UNP.</p>
      <StatistikCharts />
    </div>
  );
}