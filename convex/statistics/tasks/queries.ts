import { TableAggregate } from "@convex-dev/aggregate";
import { subWeeks } from "date-fns";
import { components } from "../../_generated/api";
import { DataModel, Id } from "../../_generated/dataModel";
import { query, QueryCtx } from "../../_generated/server";
import { authComponent } from "../../auth";

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

export const totalFocusTimeByUser = async (
  ctx: QueryCtx,
  args: { userId: Id<"users"> },
) => {
  const result: number = await durationByUserAggregate.sum(ctx, {
    namespace: [args.userId, true],
    bounds: {} as any,
  });
  return result;
};

export const totalFocusTimeByUserForWeek = async (
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
  const lowerBound = now - numDays * dayInMs;

  const tasks = await ctx.db
    .query("tasks")
    .withIndex("by_user_completion_time", (q) =>
      q
        .eq("userId", userId)
        .gte("completedAt", lowerBound)
        .lte("completedAt", now),
    )
    .collect();

  const hourlyDurations = Array(24).fill(0);
  const dailyDurations = Array(7).fill(0);

  for (const t of tasks) {
    if (!t.completed || t.completedAt == null) continue;
    const ts = t.completedAt;
    const date = new Date(ts);
    const h = date.getUTCHours();
    const d = date.getUTCDay();
    hourlyDurations[h] += t.duration || 0;
    dailyDurations[d] += t.duration || 0;
  }

  if (tasks.length === 0) {
    return { mostProductiveHour: null, mostProductiveDay: null };
  }

  return {
    mostProductiveHour: hourlyDurations.indexOf(Math.max(...hourlyDurations)), // 0–23
    mostProductiveDay: dailyDurations.indexOf(Math.max(...dailyDurations)), // 0–6
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
  const lowerBound = now - numDays * dayInMs;

  const tasks = await ctx.db
    .query("tasks")
    .withIndex("by_user_completion_time", (q) =>
      q
        .eq("userId", userId)
        .gte("completedAt", lowerBound)
        .lte("completedAt", now),
    )
    .collect();

  const aggregatedData = {
    totalSum: 0,
    totalCount: 0,
    dailySums: Array(7).fill(0),
    dailyCounts: Array(7).fill(0),
  };

  for (const t of tasks) {
    if (!t.completed || t.completedAt == null) continue;
    const ts = t.completedAt;
    const date = new Date(ts);
    const dayOfWeek = date.getUTCDay();
    const dur = t.duration || 0;

    aggregatedData.totalSum += dur;
    aggregatedData.totalCount += 1;
    aggregatedData.dailySums[dayOfWeek] += dur;
    aggregatedData.dailyCounts[dayOfWeek] += 1;
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
    const userMetadata = await authComponent.getAuthUser(ctx);
    if (!userMetadata.userId) throw new Error("User not authenticated");
    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const userId = user._id;
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
