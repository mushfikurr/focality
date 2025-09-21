import { AchievementsSkeleton } from "@/components/dashboard/achievements/skeleton";
import { ProductivityInsightsSkeleton } from "@/components/dashboard/productivity-insights/productivity-insights";
import { SessionHistorySkeleton } from "@/components/dashboard/session-history/session-history";
import { StatisticsSkeleton } from "@/components/dashboard/statistics-overview/statistics";

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatisticsSkeleton />
      </div>

      <div className="mb-8">
        <ProductivityInsightsSkeleton />
      </div>

      <div className="mb-8">
        <AchievementsSkeleton />
      </div>

      <div className="mb-8">
        <SessionHistorySkeleton />
      </div>
    </>
  );
}
export default DashboardSkeleton;
