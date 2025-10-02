import { AchievementsSkeleton } from "@/components/dashboard/achievements/skeleton";
import { FocusActivitySkeleton } from "@/components/dashboard/productivity-insights/focus-activity";
import { SessionHistorySkeleton } from "@/components/dashboard/session-history/session-history";
import { StatisticsSkeleton } from "@/components/dashboard/statistics-overview/statistics";

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatisticsSkeleton />
      </div>

      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-1 lg:grid-cols-2">
        <div className="mb-6">
          <FocusActivitySkeleton />
        </div>
        <div className="mb-6">
          <AchievementsSkeleton />
        </div>
      </div>

      <div className="mb-6">
        <SessionHistorySkeleton />
      </div>
    </>
  );
}
export default DashboardSkeleton;
