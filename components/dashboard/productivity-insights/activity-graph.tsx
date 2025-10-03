"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef } from "react";

type ActivityGraphProps = {
  weeklyData: number[];
};

export default function ActivityGraph({ weeklyData }: ActivityGraphProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      const tolerance = 20;

      const atEnd =
        el.scrollWidth - el.clientWidth - el.scrollLeft <= tolerance;

      if (atEnd) {
        el.scrollTo({
          left: el.scrollWidth,
          behavior: "smooth",
        });
      }
    }
  }, []);
  const totalWeeks = weeklyData.length;
  const now = new Date();

  const getIntensity = (hours: number) => {
    if (hours === 0) return "bg-muted/60";

    if (hours < 1)
      return "bg-green-100 border-green-900/20 dark:bg-green-900 dark:border-green-100/20";

    if (hours < 2)
      return "bg-green-300 border-green-700/20 dark:bg-green-700 dark:border-green-300/20";

    if (hours < 4)
      return "bg-green-400 border-green-600/20 dark:bg-green-600 dark:border-green-400/20";

    return "bg-green-500 border-green-500/20 dark:bg-green-500 dark:border-green-500/20";
  };

  // Group weeks by month
  const getMonths = () => {
    const months: {
      month: string;
      weeks: { date: string; hours: number }[];
    }[] = [];
    let currentMonth = "";
    let currentWeeks: { date: string; hours: number }[] = [];
    for (let i = 0; i < totalWeeks; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (totalWeeks - 1 - i) * 7);
      const month = date.toLocaleString("default", {
        month: "short",
      });
      if (month !== currentMonth) {
        if (currentWeeks.length > 0) {
          months.push({ month: currentMonth, weeks: currentWeeks });
        }
        currentMonth = month;
        currentWeeks = [];
      }
      currentWeeks.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        hours: weeklyData[i],
      });
    }
    if (currentWeeks.length > 0) {
      months.push({ month: currentMonth, weeks: currentWeeks });
    }
    return months;
  };

  const months = getMonths();

  return (
    <ScrollArea className="w-full rounded">
      <div ref={scrollRef} className="flex justify-between gap-2">
        {months.map((monthData, monthIndex) => (
          <div key={monthIndex} className="flex flex-col items-center gap-2">
            <div className="text-muted-foreground text-xs">
              {monthData.month}
            </div>
            {monthData.weeks.map((week, weekIndex) => (
              <Tooltip key={weekIndex}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "border-border h-4 w-4 rounded-sm border",
                      getIntensity(week.hours),
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  Week of {week.date}: {week.hours.toFixed(1)} hours
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
