"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { intervalToDuration } from "date-fns";
import { Award, CheckCheck, Clock, Flame } from "lucide-react";
import { StatisticCard } from "./statistics-card";

interface StatisticsProps {
  preloadedTotalFocusTime: Preloaded<
    typeof api.statistics.tasks.queries.totalFocusTimeByCurrentUser
  >;
  preloadedTotalFocusTimeByWeek: Preloaded<
    typeof api.statistics.tasks.queries.totalFocusTimeByCurrentUserForWeek
  >;
  preloadedCompletedSessions: Preloaded<
    typeof api.statistics.sessions.queries.totalCompletionByCurrentUser
  >;
  preloadedCompletedSessionsByWeek: Preloaded<
    typeof api.statistics.sessions.queries.totalCompletionByCurrentUserForWeek
  >;
  preloadedStreak: Preloaded<typeof api.streaks.queries.getByCurrentUser>;
  preloadedStreakHighest: Preloaded<
    typeof api.streaks.queries.getHighestStreakByCurrentUser
  >;
}

export default function Statistics(props: StatisticsProps) {
  const totalFocusTime = usePreloadedQuery(props.preloadedTotalFocusTime);
  const focusDuration = intervalToDuration({ start: 0, end: totalFocusTime });
  const formattedFocusTime = `${focusDuration.hours ?? 0}h ${focusDuration.minutes ?? 0}m`;

  const totalFocusTimeByWeek = usePreloadedQuery(
    props.preloadedTotalFocusTimeByWeek,
  );
  const focusDurationByWeek = intervalToDuration({
    start: 0,
    end: totalFocusTimeByWeek,
  });
  const formattedFocusTimeByWeek = `${focusDurationByWeek.hours ?? 0}h ${focusDurationByWeek.minutes ?? 0}m`;

  const totalSessionCompleted = usePreloadedQuery(
    props.preloadedCompletedSessions,
  );
  const weeklySessionCompleted = usePreloadedQuery(
    props.preloadedCompletedSessionsByWeek,
  );

  const streak = usePreloadedQuery(props.preloadedStreak);
  const highestStreak = usePreloadedQuery(props.preloadedStreakHighest);
  return (
    <>
      <StatisticCard
        cardTitle="Total Focus Time"
        statHeading={formattedFocusTime}
        statSubheading={`${formattedFocusTimeByWeek} this week`}
        Icon={Clock}
      />

      <StatisticCard
        cardTitle="Sessions Completed"
        statHeading={`${totalSessionCompleted}`}
        statSubheading={`${weeklySessionCompleted} this week`}
        Icon={CheckCheck}
      />

      <StatisticCard
        cardTitle="Current Streak"
        statHeading={`${streak?.streak ?? 0}`}
        statSubheading={`Best: ${highestStreak ?? 0}`}
        Icon={Flame}
      />

      <StatisticCard
        cardTitle="Total XP"
        statHeading="4,250"
        statSubheading="Level 8 (750 to Level 9)"
        Icon={Award}
      />
    </>
  );
}
