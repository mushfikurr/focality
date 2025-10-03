"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";

import { Skeleton } from "@/components/ui/skeleton";
import { BarChart } from "lucide-react";
import ActivityGraph from "./activity-graph";
import { api } from "@/convex/_generated/api";

type FocusActivityProps = {
  preloadedTasks: NonNullable<
    (typeof api.dashboard.queries.getDashboardData)["_returnType"]
  >["tasks"];
};

export default function FocusActivity({ preloadedTasks }: FocusActivityProps) {
  const taskStatistics = preloadedTasks;

  if (!taskStatistics) {
    return <FocusActivitySkeleton />;
  }

  const weeklyFocusHours = taskStatistics.weeklyFocusHours || [];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart className="text-primary h-4 w-4" />
          <CardTitle className="text-base font-semibold">
            Focus Activity
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex gap-6">
        <div className="w-full overflow-hidden">
          <ScrollArea className="h-full">
            <ActivityGraph weeklyData={weeklyFocusHours || []} />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

export function FocusActivitySkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <Skeleton className="h-4 w-32" />
        </div>
        <ScrollArea className="w-full">
          <div className="w-fit space-y-1">
            <div className="flex gap-2 pb-1">
              {Array.from({ length: 13 }, (_, j) => (
                <Skeleton key={j} className="h-5 w-5" />
              ))}
            </div>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex gap-2">
                {Array.from({ length: 13 }, (_, j) => (
                  <Skeleton key={j} className="h-5 w-5 rounded-sm" />
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
