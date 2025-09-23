import redirectIfNotAuthenticated from "@/lib/data/server/is-authenticated";
import DashboardDataProvider from "@/components/dashboard/dashboard-data-provider";

export default async function DashboardPage() {
  await redirectIfNotAuthenticated();

  return <DashboardDataProvider />;
}
