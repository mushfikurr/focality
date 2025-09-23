"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { Authenticated, AuthLoading } from "convex/react";
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

export default function DashboardDataProvider() {
  return (
    <>
      <AuthLoading>
        <DashboardSkeleton />
      </AuthLoading>
      <Authenticated>
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardDataCollection />
        </Suspense>
      </Authenticated>
    </>
  );
}

function DashboardDataCollection() {
  const dashboardData = useQuery(api.dashboard.queries.getDashboardData);

  if (!dashboardData) return <DashboardSkeleton />;

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
