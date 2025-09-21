"use client";

import { api } from "@/convex/_generated/api";
import {
  Authenticated,
  AuthLoading,
  Preloaded,
  usePreloadedQuery,
} from "convex/react";
import { Suspense } from "react";
import Achievements from "./achievements/achievements";
import { AchievementsSkeleton } from "./achievements/skeleton";
import {
  ProductivityInsights,
  ProductivityInsightsSkeleton,
} from "./productivity-insights/productivity-insights";
import SessionHistory, {
  SessionHistorySkeleton,
} from "./session-history/session-history";
import Statistics, {
  StatisticsSkeleton,
} from "./statistics-overview/statistics";
import DashboardSkeleton from "@/app/(main)/dashboard/loading";

type DashboardDataProviderProps = {
  preloadedDashboardData: Preloaded<
    typeof api.dashboard.queries.getDashboardData
  >;
};

export default function DashboardDataProvider({
  preloadedDashboardData,
}: DashboardDataProviderProps) {
  return (
    <>
      <AuthLoading>
        <DashboardSkeleton />
      </AuthLoading>
      <Authenticated>
        <DashboardDataCollection
          preloadedDashboardData={preloadedDashboardData}
        />
      </Authenticated>
    </>
  );
}

function DashboardDataCollection({
  preloadedDashboardData,
}: DashboardDataProviderProps) {
  const dashboardData = usePreloadedQuery(preloadedDashboardData);

  const {
    achievements: preloadedAchievements,
    levels: preloadedLevel,
    sessions: preloadedSessions,
    streaks: preloadedStreak,
    tasks: preloadedTasks,
    user: preloadedUser,
  } = dashboardData;

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Suspense fallback={<StatisticsSkeleton />}>
          <Statistics
            level={preloadedLevel}
            sessions={preloadedSessions}
            streaks={preloadedStreak}
            tasks={preloadedTasks}
          />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="mb-6">
          <Suspense fallback={<AchievementsSkeleton />}>
            <Achievements achivements={preloadedAchievements} />
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
          <SessionHistory user={preloadedUser} />
        </Suspense>
      </div>
    </>
  );
}
