import Achievements from "@/components/dashboard/achievements/achievements";
import { ProductivityInsights } from "@/components/dashboard/productivity-insights/productivity-insights";
import SessionHistory from "@/components/dashboard/session-history/session-history";
import Statistics, {
  StatisticsSkeleton,
} from "@/components/dashboard/statistics-overview/statistics";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { preloadWithAuth } from "@/lib/preload-with-auth";
import {
  isAuthenticatedNextjs
} from "@convex-dev/auth/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function DashboardPage() {
  const user = await isAuthenticatedNextjs();
  if (!user) return null;

  const data = await preloadDashboard();

  return (
    <div className="min-h-screen font-mono">
      <main className="container mx-auto py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-semibold">Session Management</h1>
            <p className="text-muted-foreground text-sm">
              Track, analyze, and create your focus sessions
            </p>
          </div>
          <Button asChild>
            <Link href="/session/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Session</span>
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Suspense fallback={<StatisticsSkeleton />}>
            <Statistics {...data} />
          </Suspense>
        </div>

        {/* Productivity Insights */}
        <ProductivityInsights
          preloadedTaskStatistics={data.preloadedTaskStatistics}
        />

        {/* Recent Achievements */}
        <Achievements preloadedAchievements={data.preloadedAchievements} />

        {/* Session History */}
        <SessionHistory />
      </main>
    </div>
  );
}

async function preloadDashboard() {
  const preloadedTaskStatistics = await preloadWithAuth(
    api.statistics.tasks.queries.getTaskStatisticsForCurrentUser,
  );
  const preloadedSessionStatistics = await preloadWithAuth(
    api.statistics.sessions.queries.getSessionStatisticsForCurrentUser,
  );
  const preloadedStreakInfo = await preloadWithAuth(
    api.streaks.queries.getStreakInfoByCurrentUser,
  );
  const preloadedLevelInfo = await preloadWithAuth(
    api.levels.queries.getLevelInfo,
  );
  const preloadedAchievements = await preloadWithAuth(api.achievements.queries.getAchievementsForCurrentUser);

  return {
    preloadedTaskStatistics,
    preloadedSessionStatistics,
    preloadedStreakInfo,
    preloadedLevelInfo,
    preloadedAchievements,
  };
}
