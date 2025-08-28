import { TableAggregate } from "@convex-dev/aggregate";
import { subWeeks } from "date-fns";
import { components } from "../../_generated/api";
import { DataModel, Id } from "../../_generated/dataModel";
import { query, QueryCtx } from "../../_generated/server";
import { authenticatedUser } from "../../utils/auth";

export const durationByUserAggregate = new TableAggregate<{
  Namespace: [Id<"users">, boolean];
  Key: number;
  DataModel: DataModel;
  TableName: "tasks";
}>(components.aggregateDurationByUser, {
  namespace: (doc) => [doc.userId, doc.completed],
  sortKey: (doc) => doc._creationTime,
  sumValue: (doc) => (doc.completed ? doc.duration : 0),
});

const totalFocusTimeByUser = async (
  ctx: QueryCtx,
  args: { userId: Id<"users"> },
) => {
  const result: number = await durationByUserAggregate.sum(ctx, {
    namespace: [args.userId, true],
    bounds: {} as any,
  });
  return result;
};

const totalFocusTimeByUserForWeek = async (
  ctx: QueryCtx,
  args: { userId: Id<"users"> },
) => {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const nowTime = now.getTime();
  const oneWeekAgoTime = oneWeekAgo.getTime();
  const totalFocusTimeForWeek = await durationByUserAggregate.sum(ctx, {
    namespace: [args.userId, true],
    bounds: {
      lower: { key: oneWeekAgoTime, inclusive: true },
      upper: { key: nowTime, inclusive: true },
    } as any,
  });
  return totalFocusTimeForWeek;
};

export const productivityPatternsByUser = async (
  ctx: QueryCtx,
  args: { userId: Id<"users"> },
) => {
  const userId = args.userId;
  const now = Date.now();
  const numDays = 30;
  const dayInMs = 24 * 60 * 60 * 1000;
  const hourInMs = 60 * 60 * 1000;

  const hourlyDurations = Array(24).fill(0);
  const dailyDurations = Array(7).fill(0);

  let hasData = false;

  for (let dayOffset = 0; dayOffset < numDays; dayOffset++) {
    const dayStart = new Date(now - dayOffset * dayInMs);
    dayStart.setUTCHours(0, 0, 0, 0);
    const baseTime = dayStart.getTime();
    const dayOfWeek = dayStart.getUTCDay();

    let totalForDay = 0;

    for (let hour = 0; hour < 24; hour++) {
      const start = baseTime + hour * hourInMs;
      const end = start + hourInMs;

      const sum = await durationByUserAggregate.sum(ctx, {
        namespace: [userId, true],
        bounds: {
          lower: { key: start, inclusive: true },
          upper: { key: end, inclusive: false },
        } as any,
      });

      if (sum > 0) hasData = true;

      hourlyDurations[hour] += sum;
      totalForDay += sum;
    }

    dailyDurations[dayOfWeek] += totalForDay;
  }

  if (!hasData) {
    return {
      mostProductiveHour: null,
      mostProductiveDay: null,
    };
  }

  const maxHourDuration = Math.max(...hourlyDurations);
  const mostProductiveHour = hourlyDurations.indexOf(maxHourDuration);

  const maxDayDuration = Math.max(...dailyDurations);
  const mostProductiveDay = dailyDurations.indexOf(maxDayDuration);

  return {
    mostProductiveHour, // 0–23
    mostProductiveDay, // 0–6
  };
};

export const dailyAveragesByUserForMonth = async (
  ctx: QueryCtx,
  args: { userId: Id<"users"> },
) => {
  const userId = args.userId;
  const numDays = 30;

  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  const aggregatedData = {
    totalSum: 0,
    totalCount: 0,
    dailySums: Array(7).fill(0),
    dailyCounts: Array(7).fill(0),
  };

  for (let i = 0; i < numDays; i++) {
    const current = new Date(now - i * dayInMs);
    current.setUTCHours(0, 0, 0, 0);

    const dayStart = current.getTime();
    const dayEnd = dayStart + dayInMs;

    const dayOfWeek = new Date(dayStart).getUTCDay();

    const dailySum = await durationByUserAggregate.sum(ctx, {
      namespace: [userId, true],
      bounds: {
        lower: { key: dayStart, inclusive: true },
        upper: { key: dayEnd, inclusive: false },
      } as any,
    });

    const dailyCount = await durationByUserAggregate.count(ctx, {
      namespace: [userId, true],
      bounds: {
        lower: { key: dayStart, inclusive: true },
        upper: { key: dayEnd, inclusive: false },
      } as any,
    });

    aggregatedData.totalSum += dailySum;
    aggregatedData.totalCount += dailyCount;
    aggregatedData.dailySums[dayOfWeek] += dailySum;
    aggregatedData.dailyCounts[dayOfWeek] += dailyCount;
  }

  const dailyAverages = aggregatedData.dailySums.map((sum, index) => {
    const count = aggregatedData.dailyCounts[index];
    return {
      dayOfWeek: index,
      sum,
      count,
      average: count > 0 ? sum / count : 0,
      percentage:
        aggregatedData.totalSum > 0 ? (sum / aggregatedData.totalSum) * 100 : 0,
    };
  });

  return {
    totalSum: aggregatedData.totalSum,
    totalCount: aggregatedData.totalCount,
    dailyAverages,
  };
};

export const getTaskStatisticsForCurrentUser = query({
  handler: async (ctx) => {
    const userId = await authenticatedUser(ctx);
    const totalFocusTime = await totalFocusTimeByUser(ctx, {
      userId,
    });
    const totalFocusTimeByWeek = await totalFocusTimeByUserForWeek(ctx, {
      userId,
    });
    const dailyAveragesByMonth = await dailyAveragesByUserForMonth(ctx, {
      userId,
    });
    const productivityPatterns = await productivityPatternsByUser(ctx, {
      userId,
    });
    return {
      totalFocusTime,
      totalFocusTimeByWeek,
      dailyAveragesByMonth,
      productivityPatterns,
    };
  },
});
