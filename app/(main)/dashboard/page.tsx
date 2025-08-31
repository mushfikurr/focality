import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Achievements from "@/components/dashboard/achievements/achievements";
import { AchievementsSkeleton } from "@/components/dashboard/achievements/skeleton";
import { ProductivityInsights, ProductivityInsightsSkeleton } from "@/components/dashboard/productivity-insights/productivity-insights";
import SessionHistory, { SessionHistorySkeleton } from "@/components/dashboard/session-history/session-history";
import Statistics, { StatisticsSkeleton } from "@/components/dashboard/statistics-overview/statistics";

export default function DashboardPage() {
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

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Suspense fallback={<StatisticsSkeleton />}>
            <Statistics />
          </Suspense>
        </div>

        <div className="mb-8">
          <Suspense fallback={<ProductivityInsightsSkeleton />}>
            <ProductivityInsights />
          </Suspense>
        </div>

        <div className="mb-8">
          <Suspense fallback={<AchievementsSkeleton />}>
            <Achievements />
          </Suspense>
        </div>

        <div className="mb-8">
          <Suspense fallback={<SessionHistorySkeleton />}>
            <SessionHistory />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
