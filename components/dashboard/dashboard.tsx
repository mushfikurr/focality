"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useConvexAuth, usePreloadedQuery } from "convex/react";
import SessionHistory from "./session-history/session-history";
import Statistics from "./statistics-overview/statistics";
import { useEffect, useState } from "react";
import { Achievements } from "./achievements/achievements";
import FocusActivity from "./productivity-insights/focus-activity";
import DashboardSkeleton from "@/app/(main)/dashboard/loading";
import SuggestedCard from "./suggested/suggested-card";

export default function Dashboard({
  preloadedDashboardData: preloadedDashboardDataQuery,
}: {
  preloadedDashboardData: Preloaded<
    typeof api.dashboard.queries.getDashboardData
  >;
}) {
  const { isLoading } = useConvexAuth();
  const preloadedDashboardData = usePreloadedQuery(preloadedDashboardDataQuery);
  const [dashboard, setDashboard] = useState(preloadedDashboardData);
  useEffect(() => {
    if (!isLoading) {
      setDashboard(preloadedDashboardData);
    }
  }, [preloadedDashboardData, isLoading]);

  if (isLoading || !dashboard) return <DashboardSkeleton />;
  return <DashboardLayout dashboardData={dashboard} />;
}

function DashboardLayout({
  dashboardData,
}: {
  dashboardData: NonNullable<
    (typeof api.dashboard.queries.getDashboardData)["_returnType"]
  >;
}) {
  if (!dashboardData) return null;

  const { achievements, levels, sessions, streaks, tasks, user } =
    dashboardData;

  return (
    <div className="flex grow flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Statistics
          level={levels}
          sessions={sessions}
          streaks={streaks}
          tasks={tasks}
        />
      </div>
      <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-stretch">
        <div className="max-h-60 grow">
          <SuggestedCard />
        </div>
        <div className="max-h-60">
          <FocusActivity preloadedTasks={tasks} />
        </div>
        <div className="max-h-60 xl:max-w-md xl:min-w-md">
          <Achievements achievements={achievements} />
        </div>
      </div>
      <div className="grow">
        <SessionHistory user={user} />
      </div>
    </div>
  );
}
