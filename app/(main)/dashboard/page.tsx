import Dashboard from "@/components/dashboard/dashboard";
import { preloadDashboardData } from "@/lib/data/server/preload-dashboard-data";

export default async function DashboardPage() {
  const dashboardData = await preloadDashboardData();

  return <Dashboard preloadedDashboardData={dashboardData} />;
}
