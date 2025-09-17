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
import { preloadDashboardData } from "@/lib/data/server/dashboard-data";
import redirectIfNotAuthenticated from "@/lib/data/server/is-authenticated";
import { Suspense } from "react";

export default async function DashboardPage() {
  await redirectIfNotAuthenticated();

  const {
    preloadedAchievements,
    preloadedLevel,
    preloadedSessions,
    preloadedStreak,
    preloadedTasks,
  } = await preloadDashboardData();

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
