import { StatistikCharts } from "@/app/dashboard/_components/statistik-charts";

export default function DashboardAdminPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-primary-800">Dashboard</h1>
      <StatistikCharts lengkap />
    </div>
  );
}