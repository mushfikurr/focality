"use client";
import { api } from "@/convex/_generated/api";
import { getWeekdayNameFromUTCDay } from "@/lib/utils";
import { usePreloadedQuery } from "convex/react";
import { Preloaded } from "convex/react";
import { Calendar, CheckCheck, Clock } from "lucide-react";
import PatternCard from "./pattern-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductivityPatternsProps {
  preloadedTaskStatistics: Preloaded<
    typeof api.statistics.tasks.queries.getTaskStatisticsForCurrentUser
  >;
}

export default function ProductivityPatterns({
  preloadedTaskStatistics,
}: ProductivityPatternsProps) {
  const { productivityPatterns } = usePreloadedQuery(preloadedTaskStatistics);
  const { mostProductiveDay, mostProductiveHour } = productivityPatterns;
  const hourDate = new Date();
  hourDate.setHours(mostProductiveHour);
  hourDate.setMinutes(0);
  hourDate.setSeconds(0);
  const fmtHour = hourDate.toLocaleTimeString("en-GB", {
    timeStyle: "short",
    hour12: true,
  });

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium">Productivity Patterns</h3>
      <div className="grid grid-cols-2 gap-y-3">
        <PatternCard
          title={"Most Productive Time"}
          icon={Clock}
          description={fmtHour}
        />
        <PatternCard
          title={"Most Productive Day"}
          icon={Calendar}
          description={getWeekdayNameFromUTCDay(mostProductiveDay)}
        />
        <PatternCard
          title={"Average Session Completion"}
          icon={CheckCheck}
          description={"92%"}
        />
      </div>
    </div>
  );
}

export function ProductivityPatternsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-3 h-4 w-32" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-3">
        <Skeleton className="h-[40px] w-full" />
        <Skeleton className="h-[40px] w-full" />
        <Skeleton className="h-[40px] w-full" />
      </div>
    </div>
  );
}
