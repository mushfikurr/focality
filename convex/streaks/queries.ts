import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { authComponent } from "../auth";
import { getDocumentOrThrow } from "../utils/db";

export const getStreakInfoByCurrentUser = query({
  handler: async (ctx) => {
    const userMetadata = await authComponent.safeGetAuthUser(ctx);
    if (!userMetadata) return null;

    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) return null;

    const userId = user._id;

    const streak = await ctx.db
      .query("streaks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    const highestStreak = user.highestStreak;
    return { streak, highestStreak };
  },
});

export const getStreakInfoByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await getDocumentOrThrow(ctx, "users", args.userId);
    const streak = await ctx.db
      .query("streaks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    const highestStreak = user.highestStreak;
    return { streak, highestStreak };
  },
});
