import Achievements from "@/components/dashboard/achievements/achievements";
import { AchievementsSkeleton } from "@/components/dashboard/achievements/skeleton";
import {
  ProductivityInsights,
  ProductivityInsightsSkeleton,
} from "@/components/dashboard/productivity-insights/productivity-insights";
import SessionHistory, {
  SessionHistorySkeleton,
} from "@/components/dashboard/session-history/session-history";
import Statistics, {
  StatisticsSkeleton,
} from "@/components/dashboard/statistics-overview/statistics";
import {
  preloadDashboardData,
  preloadPaginatedSessions,
} from "@/lib/data/server/dashboard-data";
import { Suspense } from "react";

export default async function DashboardPage() {
  const {
    preloadedAchievements,
    preloadedLevel,
    preloadedSessions,
    preloadedStreak,
    preloadedTasks,
    preloadedUser,
  } = await preloadDashboardData();

  let preloadedPaginatedSessions;
  if (preloadedUser.data) {
    preloadedPaginatedSessions = await preloadPaginatedSessions(
      preloadedUser.data._id,
    );
  }

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Suspense fallback={<StatisticsSkeleton />}>
          <Statistics
            preloadedLevel={preloadedLevel}
            preloadedSessions={preloadedSessions}
            preloadedStreak={preloadedStreak}
            preloadedTasks={preloadedTasks}
          />
        </Suspense>
      </div>

      <div className="mb-8">
        <Suspense fallback={<ProductivityInsightsSkeleton />}>
          <ProductivityInsights preloadedTasks={preloadedTasks} />
        </Suspense>
      </div>

      <div className="mb-8">
        <Suspense fallback={<AchievementsSkeleton />}>
          <Achievements preloadedAchievements={preloadedAchievements} />
        </Suspense>
      </div>

      <div className="mb-8">
        <Suspense fallback={<SessionHistorySkeleton />}>
          <SessionHistory />
        </Suspense>
      </div>
    </>
  );
}
