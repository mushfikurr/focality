import DashboardDataProvider from "@/components/dashboard/dashboard-data-provider";
import { getToken } from "@/lib/data/server/token";

export default async function DashboardPage() {
  await getToken();
  return <DashboardDataProvider />;
}
