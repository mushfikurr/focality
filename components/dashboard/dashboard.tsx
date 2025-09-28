"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useConvexAuth, usePreloadedQuery } from "convex/react";
import SessionHistory from "./session-history/session-history";
import Statistics from "./statistics-overview/statistics";
import { useEffect, useState } from "react";
import { Achievements } from "./achievements/achievements";
import ProductivityInsights from "./productivity-insights/productivity-insights";

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

  return <DashboardLayout dashboardData={dashboard} />;
}

function DashboardLayout({
  dashboardData,
}: {
  dashboardData: (typeof api.dashboard.queries.getDashboardData)["_returnType"];
}) {
  const { achievements, levels, sessions, streaks, tasks, user } =
    dashboardData;

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Statistics
          level={levels}
          sessions={sessions}
          streaks={streaks}
          tasks={tasks}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="mb-6">
          <Achievements achievements={achievements} />
        </div>
        <div className="mb-6 lg:col-span-2">
          <ProductivityInsights preloadedTasks={tasks} />
        </div>
      </div>
      <div className="mb-6">
        <SessionHistory user={user} />
      </div>
    </>
  );
}
