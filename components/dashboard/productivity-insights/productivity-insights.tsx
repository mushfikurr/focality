"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimestampToHS, getWeekdayNameFromUTCDay } from "@/lib/utils";
import { BarChart, Calendar, Clock } from "lucide-react";
import PatternCard from "./pattern-card";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";

type ProductivityInsightsProps = {
  preloadedTasks: (typeof api.dashboard.queries.getDashboardData)["_returnType"]["tasks"];
};

export default function ProductivityInsights({
  preloadedTasks,
}: ProductivityInsightsProps) {
  const taskStatistics = preloadedTasks;

  if (!taskStatistics) {
    return <ProductivityInsightsSkeleton />;
  }

  const { dailyAveragesByMonth, productivityPatterns } = taskStatistics;
  const { mostProductiveDay, mostProductiveHour } = productivityPatterns;

  const fmtDay = mostProductiveDay
    ? getWeekdayNameFromUTCDay(mostProductiveDay)
    : "N/A";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BarChart className="text-primary h-4 w-4" />
          <CardTitle className="text-base font-semibold">
            Productivity Insights
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-medium">Weekly Focus Hours</h3>
          <div className="space-y-2">
            {dailyAveragesByMonth.dailyAverages.map((dailyAverage) => (
              <Day key={dailyAverage.dayOfWeek} {...dailyAverage} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium">Productivity Patterns</h3>
          <div className="grid grid-cols-2 gap-y-3">
            <PatternCard
              title={"Most Productive Time"}
              icon={Clock}
              description={
                mostProductiveHour !== null &&
                mostProductiveHour !== undefined ? (
                  <ClientHour hour={mostProductiveHour} />
                ) : (
                  "N/A"
                )
              }
            />
            <PatternCard
              title={"Most Productive Day"}
              icon={Calendar}
              description={fmtDay}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientHour({ hour }: { hour: number }) {
  const [value, setValue] = useState<string>("…");

  useEffect(() => {
    const date = new Date();
    date.setUTCHours(hour, 0, 0, 0);
    setValue(
      date.toLocaleTimeString("en-GB", {
        timeStyle: "short",
        hour12: true,
      }),
    );
  }, [hour]);

  return <>{value}</>;
}

export function ProductivityInsightsSkeleton() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
        <div>
          <Skeleton className="mb-3 h-4 w-32" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[40px] w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
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
  const formattedTime = formatTimestampToHS(props.sum);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex items-center gap-6">
      <span className="w-10 text-xs">{days[props.dayOfWeek]}</span>
      <div className="bg-muted h-4 flex-grow">
        <Progress className="h-4" value={props.percentage} />
      </div>
      <span className="w-12 text-right text-xs">{formattedTime}</span>
    </div>
  );
}
