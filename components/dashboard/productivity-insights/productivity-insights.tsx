import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import {
  DailyFocusTimeByMonth,
  DailyFocusTimeByMonthSkeleton,
} from "../insights/insights";
import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Weekly Focus Hours */}
          <DailyFocusTimeByMonth
            preloadedTaskStatistics={preloadedTaskStatistics}
          />

          {/* Productivity Patterns */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Productivity Patterns</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs">Most Productive Time</span>
                  <span className="text-xs font-medium">
                    9:00 AM - 11:00 AM
                  </span>
                </div>
                <div className="bg-muted h-2 w-full">
                  <div
                    className="bg-primary h-2"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs">Most Productive Day</span>
                  <span className="text-xs font-medium">Tuesday</span>
                </div>
                <div className="bg-muted h-2 w-full">
                  <div
                    className="bg-primary h-2"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs">Average Session Completion</span>
                  <span className="text-xs font-medium">92%</span>
                </div>
                <div className="bg-muted h-2 w-full">
                  <div
                    className="bg-primary h-2"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>

              {/* <div className="pt-2">
            <h4 className="mb-2 text-xs font-medium">
              Top Focus Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="default"
                className="flex items-center gap-1 text-xs"
              >
                Work (45%)
              </Badge>
              <Badge
                variant="secondary"
                className="text-secondary-foreground flex items-center gap-1 text-xs"
              >
                Study (30%)
              </Badge>
              <Badge
                variant="default"
                className="bg-accent text-accent-foreground flex items-center gap-1 text-xs"
              >
                Personal (25%)
              </Badge>
            </div>
          </div> */}
            </div>
          </div>
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
        </div>
      </CardContent>
    </Card>
  );
}
