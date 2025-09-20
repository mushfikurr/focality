"use client";

import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { Authenticated, Preloaded, usePreloadedQuery } from "convex/react";
import { intervalToDuration } from "date-fns";
import { CheckCheck, Clock, Flame, TrendingUp } from "lucide-react";
import { StatisticCard, StatisticCardSkeleton } from "./statistics-card";

type StatisticsProps = {
  preloadedTasks: Preloaded<
    typeof api.statistics.tasks.queries.getTaskStatisticsForCurrentUser
  >;
  preloadedSessions: Preloaded<
    typeof api.statistics.sessions.queries.getSessionStatisticsForCurrentUser
  >;
  preloadedStreak: Preloaded<
    typeof api.streaks.queries.getStreakInfoByCurrentUser
  >;
  preloadedLevel: Preloaded<typeof api.levels.queries.getLevelInfo>;
};

export default function Statistics(props: StatisticsProps) {
  return (
    <Authenticated>
      <StatisticsCollection {...props} />
    </Authenticated>
  );
}

function StatisticsCollection({
  preloadedLevel,
  preloadedSessions,
  preloadedStreak,
  preloadedTasks,
}: StatisticsProps) {
  const taskStatistics = usePreloadedQuery(preloadedTasks);
  const sessionStatistics = usePreloadedQuery(preloadedSessions);
  const streakInfo = usePreloadedQuery(preloadedStreak);
  const levelInfo = usePreloadedQuery(preloadedLevel);

  if (!taskStatistics || !sessionStatistics || !streakInfo || !levelInfo) {
    return <StatisticsSkeleton />;
  }

  const focusDurationByWeek = intervalToDuration({
    start: 0,
    end: taskStatistics.totalFocusTimeByWeek,
  });
  const focusDuration = intervalToDuration({
    start: 0,
    end: taskStatistics.totalFocusTime,
  });
  const formattedFocusTime = `${focusDuration.hours ?? 0}h ${
    focusDuration.minutes ?? 0
  }m`;
  const formattedFocusTimeByWeek = `${focusDurationByWeek.hours ?? 0}h ${
    focusDurationByWeek.minutes ?? 0
  }m`;

  const { streak, highestStreak } = streakInfo;

  return (
    <>
      <StatisticCard
        cardTitle={<XPStatCardTitle totalXP={levelInfo.totalXP} />}
        statHeading={`${levelInfo.level}`}
        statSubheading={<XPStatSubheading {...levelInfo} />}
      />

      <StatisticCard
        cardTitle="Current Streak"
        statHeading={`${streak?.streak ?? 0}`}
        statSubheading={`Best: ${highestStreak ?? 0}`}
        Icon={Flame}
      />

      <StatisticCard
        cardTitle="Focus Time"
        statHeading={formattedFocusTime}
        statSubheading={`${formattedFocusTimeByWeek} this week`}
        Icon={Clock}
      />

      <StatisticCard
        cardTitle="Sessions Completed"
        statHeading={`${sessionStatistics.totalCompletion}`}
        statSubheading={`${sessionStatistics.totalCompletionByWeek} this week`}
        Icon={CheckCheck}
      />
    </>
  );
}

type XPStatCardTitleProps = {
  totalXP: number;
};

function XPStatCardTitle({ totalXP }: XPStatCardTitleProps) {
  return (
    <span className="flex w-full items-center justify-between gap-2">
      <p>Level</p>
      <Badge variant="secondary" className="text-xs">
        {totalXP > 0 && (
          <TrendingUp
            className="text-accent-foreground mr-1 h-3 w-3"
            strokeWidth={3}
          />
        )}
        {totalXP} XP
      </Badge>
    </span>
  );
}

type XPStatSubheadingProps = {
  level: number;
  totalXP: number;
  xpToNextLevel: number;
};
function XPStatSubheading({ level, xpToNextLevel }: XPStatSubheadingProps) {
  const xpToNextLevelFmt = `${xpToNextLevel} XP to Level ${level + 1}`;
  return <span className="text-muted-foreground">{xpToNextLevelFmt}</span>;
}

export function StatisticsSkeleton() {
  return (
    <>
      <StatisticCardSkeleton />
      <StatisticCardSkeleton />
      <StatisticCardSkeleton />
      <StatisticCardSkeleton />
    </>
  );
}
