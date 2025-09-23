"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { Authenticated, AuthLoading } from "convex/react";
import Achievements from "./achievements/achievements";
import { ProductivityInsights } from "./productivity-insights/productivity-insights";
import SessionHistory from "./session-history/session-history";
import Statistics from "./statistics-overview/statistics";
import DashboardSkeleton from "@/app/(main)/dashboard/loading";

export default function DashboardDataProvider() {
  return (
    <>
      <AuthLoading>
        <DashboardSkeleton />
      </AuthLoading>
      <Authenticated>
        <DashboardDataCollection />
      </Authenticated>
    </>
  );
}

function DashboardDataCollection() {
  const {
    data: dashboardData,
    isPending,
    error,
  } = useQuery(convexQuery(api.dashboard.queries.getDashboardData, {}));

  if (isPending) return <DashboardSkeleton />;

  if (error) {
    console.error("Dashboard query error:", error);
    return <DashboardSkeleton />;
  }

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
        <Statistics
          level={preloadedLevel}
          sessions={preloadedSessions}
          streaks={preloadedStreak}
          tasks={preloadedTasks}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="mb-6">
          <Achievements achivements={preloadedAchievements} />
        </div>
        <div className="mb-6 lg:col-span-2">
          <ProductivityInsights preloadedTasks={preloadedTasks} />
        </div>
      </div>
      <div className="mb-6">
        <SessionHistory user={preloadedUser} />
      </div>
    </>
  );
}
