"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { intervalToDuration } from "date-fns";
import { Award, CheckCheck, Clock, Flame } from "lucide-react";
import { StatisticCard } from "./statistics-card";

interface StatisticsProps {
  preloadedTotalFocusTime: Preloaded<
    typeof api.statistics.queries.totalFocusTimeByCurrentUser
  >;
  preloadedTotalFocusTimeByWeek: Preloaded<
    typeof api.statistics.queries.totalFocusTimeByCurrentUserForWeek
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
        statHeading="87"
        statSubheading="+12 this week"
        Icon={CheckCheck}
      />

      <StatisticCard
        cardTitle="Current Streak"
        statHeading="5 days"
        statSubheading="Best: 14 days"
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
