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

export const totalFocusTimeByCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await authenticatedUser(ctx);
    return totalFocusTimeByUser(ctx, { userId });
  },
});

export const totalFocusTimeByCurrentUserForWeek = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);
    return await totalFocusTimeByUserForWeek(ctx, {
      userId,
    });
  },
});

export const dailyAveragesByCurrentUserForMonth = query({
  args: {},
  handler: async (ctx) => {
    const userId = await authenticatedUser(ctx);
    return await dailyAveragesByUserForMonth(ctx, { userId });
  },
});
