"use client";

import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { formatTimestampToHS } from "@/lib/utils";
import { Preloaded, usePreloadedQuery } from "convex/react";

interface DailyFocusTimeByMonthProps {
  preloadedTaskStatistics: Preloaded<
    typeof api.statistics.tasks.queries.getTaskStatisticsForCurrentUser
  >;
}

export function DailyFocusTimeByMonth(props: DailyFocusTimeByMonthProps) {
  const { dailyAveragesByMonth } = usePreloadedQuery(
    props.preloadedTaskStatistics,
  );

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium">Weekly Focus Hours</h3>
      <div className="space-y-2">
        {dailyAveragesByMonth.dailyAverages.map((dailyAverage) => (
          <Day key={dailyAverage.dayOfWeek} {...dailyAverage} />
        ))}
      </div>
    </div>
  );
}

export function DailyFocusTimeByMonthSkeleton() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <Skeleton className="mb-3 h-4 w-32" />
      <div className="space-y-2">
        {days.map((day) => (
          <div key={day} className="flex items-center gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12 flex-grow" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

type DayProps = {
  dayOfWeek: number;
  sum: any;
  count: any;
  average: number;
  percentage: number;
};

function Day(props: DayProps) {
  console.log("avg", props.average);
  const formattedTime = formatTimestampToHS(props.sum);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-xs">{days[props.dayOfWeek]}</span>
      <div className="bg-muted h-4 flex-grow">
        <Progress className="h-4" value={props.percentage} />
      </div>
      <span className="w-12 text-right text-xs">{formattedTime}</span>
    </div>
  );
}
