import Achievements from "@/components/dashboard/achievements/achievements";
import { ProductivityInsights } from "@/components/dashboard/productivity-insights/productivity-insights";
import SessionHistory from "@/components/dashboard/session-history/session-history";
import Statistics, {
  StatisticsSkeleton,
} from "@/components/dashboard/statistics-overview/statistics";
import { buttonVariants } from "@/components/ui/button";
import { preloadDashboard } from "@/lib/data/preload-dashboard";
import { cn } from "@/lib/utils";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function DashboardPage() {
  const user = await isAuthenticatedNextjs();
  const data = user ? await preloadDashboard() : null;

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-semibold">Session Management</h1>
            <p className="text-muted-foreground text-sm">
              Track, analyze, and create your focus sessions
            </p>
          </div>
          <Link
            href="/session/new"
            className={cn("flex items-center gap-2", buttonVariants({}))}
          >
            <Plus className="h-4 w-4" />
            <span>New Session</span>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Suspense fallback={<StatisticsSkeleton />}>
            {user && data && <Statistics {...data} />}
          </Suspense>
        </div>

        {/* Productivity Insights */}
        {user && data && (
          <ProductivityInsights
            preloadedTaskStatistics={data.preloadedTaskStatistics}
          />
        )}

        {/* Recent Achievements */}
        {user && data && (
          <Achievements preloadedAchievements={data.preloadedAchievements} />
        )}

        {/* Session History */}
        <SessionHistory />
      </main>
    </div>
  );
}
