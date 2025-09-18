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
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Suspense fallback={<StatisticsSkeleton />}>
          <Statistics
            preloadedLevel={preloadedLevel}
            preloadedSessions={preloadedSessions}
            preloadedStreak={preloadedStreak}
            preloadedTasks={preloadedTasks}
          />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="mb-6">
          <Suspense fallback={<AchievementsSkeleton />}>
            <Achievements preloadedAchievements={preloadedAchievements} />
          </Suspense>
        </div>
        <div className="mb-6 lg:col-span-2">
          <Suspense fallback={<ProductivityInsightsSkeleton />}>
            <ProductivityInsights preloadedTasks={preloadedTasks} />
          </Suspense>
        </div>
      </div>
      <div className="mb-6">
        <Suspense fallback={<SessionHistorySkeleton />}>
          <SessionHistory />
        </Suspense>
      </div>
    </>
  );
}
