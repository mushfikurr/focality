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
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Statistics
          level={levels}
          sessions={sessions}
          streaks={streaks}
          tasks={tasks}
        />
      </div>
      <div className="flex w-full gap-4">
        <div className="mb-6 grow">
          <SuggestedCard />
        </div>
        <div className="mb-6">
          <FocusActivity preloadedTasks={tasks} />
        </div>
        <div className="mb-6">
          <Achievements achievements={achievements} />
        </div>
      </div>
      <div className="mb-6">
        <SessionHistory user={user} />
      </div>
    </>
  );
}
