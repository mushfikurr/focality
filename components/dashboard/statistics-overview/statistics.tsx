"use client";

import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { intervalToDuration } from "date-fns";
import { Award, CheckCheck, Clock, Flame, TrendingUp } from "lucide-react";
import { StatisticCard, StatisticCardSkeleton } from "./statistics-card";

interface StatisticsProps {
  preloadedTaskStatistics: Preloaded<
    typeof api.statistics.tasks.queries.getTaskStatisticsForCurrentUser
  >;
  preloadedSessionStatistics: Preloaded<
    typeof api.statistics.sessions.queries.getSessionStatisticsForCurrentUser
  >;
  preloadedStreakInfo: Preloaded<
    typeof api.streaks.queries.getStreakInfoByCurrentUser
  >;
  preloadedLevelInfo: Preloaded<typeof api.levels.queries.getLevelInfo>;
}

export default function Statistics(props: StatisticsProps) {
  const taskStatististics = usePreloadedQuery(props.preloadedTaskStatistics);
  const focusDurationByWeek = intervalToDuration({
    start: 0,
    end: taskStatististics.totalFocusTimeByWeek,
  });
  const focusDuration = intervalToDuration({
    start: 0,
    end: taskStatististics.totalFocusTime,
  });
  const formattedFocusTime = `${focusDuration.hours ?? 0}h ${focusDuration.minutes ?? 0}m`;
  const formattedFocusTimeByWeek = `${focusDurationByWeek.hours ?? 0}h ${focusDurationByWeek.minutes ?? 0}m`;

  const sessionStatistics = usePreloadedQuery(props.preloadedSessionStatistics);
  const { streak, highestStreak } = usePreloadedQuery(
    props.preloadedStreakInfo,
  );
  const levelInfo = usePreloadedQuery(props.preloadedLevelInfo);

  return (
    <>
      <StatisticCard
        cardTitle={<XPStatCardTitle totalXP={levelInfo.totalXP} />}
        statHeading={`${levelInfo.level}`}
        statSubheading={<XPStatSubheading {...levelInfo} />}
        Icon={Award}
      />

      <StatisticCard
        cardTitle="Current Streak"
        statHeading={`${streak?.streak ?? 0}`}
        statSubheading={`Best: ${highestStreak ?? 0}`}
        Icon={Flame}
      />

      <StatisticCard
        cardTitle="Total Focus Time"
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
    <span className="flex items-center justify-between gap-2">
      <p>Level</p>
      <Badge variant="outline" className="text-xs">{totalXP > 0 &&
        <TrendingUp
          className="text-accent-foreground mr-1 h-3 w-3"
          strokeWidth={3}
        />}{" "}
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
function XPStatSubheading({
  level,
  totalXP,
  xpToNextLevel,
}: XPStatSubheadingProps) {
  return (
    <span className="text-muted-foreground flex items-center gap-2">
      <span>{xpToNextLevel} XP</span>
      <span>to</span>
      <span>Level {level + 1}</span>
    </span>
  );
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
