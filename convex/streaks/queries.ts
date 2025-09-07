import { v } from "convex/values";
import { query } from "../_generated/server";
import { currentUser } from "../auth";
import { getDocumentOrThrow } from "../utils/db";

export const getStreakInfoByCurrentUser = query({
  handler: async (ctx) => {
    const user = await currentUser(ctx);
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
