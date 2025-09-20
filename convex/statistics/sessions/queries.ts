import { TableAggregate } from "@convex-dev/aggregate";
import { subWeeks } from "date-fns";
import { components } from "../../_generated/api";
import { DataModel, Id } from "../../_generated/dataModel";
import { query, QueryCtx } from "../../_generated/server";
import { authComponent } from "../../auth";

export const completionByUserAggregate = new TableAggregate<{
  Namespace: [Id<"users">, boolean];
  Key: number;
  DataModel: DataModel;
  TableName: "sessions";
}>(components.aggregateSessionCompletionByUser, {
  namespace: (doc) => [doc.hostId, doc.completed],
  sortKey: (doc) => doc._creationTime,
  sumValue: (doc) => (doc.completed ? 1 : 0),
});

const totalCompletionByUser = async (
  ctx: QueryCtx,
  args: { userId: Id<"users"> },
) => {
  const result: number = await completionByUserAggregate.sum(ctx, {
    namespace: [args.userId, true],
    bounds: {} as any,
  });
  return result;
};

const totalCompletionByUserForWeek = async (
  ctx: QueryCtx,
  args: { userId: Id<"users"> },
) => {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const nowTime = now.getTime();
  const oneWeekAgoTime = oneWeekAgo.getTime();
  const totalCompletionForWeek = await completionByUserAggregate.sum(ctx, {
    namespace: [args.userId, true],
    bounds: {
      lower: { key: oneWeekAgoTime, inclusive: true },
      upper: { key: nowTime, inclusive: true },
    } as any,
  });
  return totalCompletionForWeek;
};

export const getSessionStatisticsForCurrentUser = query({
  handler: async (ctx) => {
    const userMetadata = await authComponent.getAuthUser(ctx);
    if (!userMetadata.userId) throw new Error("User not authenticated");
    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const userId = user._id;
    const totalCompletion = await totalCompletionByUser(ctx, {
      userId,
    });
    const totalCompletionByWeek = await totalCompletionByUserForWeek(ctx, {
      userId,
    });
    return { totalCompletion, totalCompletionByWeek };
  },
});
