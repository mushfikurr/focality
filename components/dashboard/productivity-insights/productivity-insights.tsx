import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import {
  DailyFocusTimeByMonth,
  DailyFocusTimeByMonthSkeleton,
} from "../insights/insights";
import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import ProductivityPatterns, {
  ProductivityPatternsSkeleton,
} from "../productivity-patterns";

type DailyFocusTimeByMonthProps = {
  preloadedTaskStatistics: Preloaded<
    typeof api.statistics.tasks.queries.getTaskStatisticsForCurrentUser
  >;
};

export function ProductivityInsights({
  preloadedTaskStatistics,
}: DailyFocusTimeByMonthProps) {
  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="text-primary h-4 w-4" />
            <CardTitle className="text-base font-semibold">
              Productivity Insights
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Weekly Focus Hours */}
          <DailyFocusTimeByMonth
            preloadedTaskStatistics={preloadedTaskStatistics}
          />

          {/* Productivity Patterns */}
          <ProductivityPatterns
            preloadedTaskStatistics={preloadedTaskStatistics}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductivityInsightsSkeleton() {
  return (
    <Card className="mb-8">
      <CardHeader className="mb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-20" />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Weekly Focus Hours */}
          <DailyFocusTimeByMonthSkeleton />
          <ProductivityPatternsSkeleton />
        </div>
      </CardContent>
    </Card>
  );
}
