import { v } from "convex/values";
import { query } from "../_generated/server";
import { authenticatedUser } from "../utils/auth";
import { getDocumentOrThrow } from "../utils/db";

export const getByCurrentUser = query({
  handler: async (ctx) => {
    const user = await authenticatedUser(ctx);
    return await ctx.db
      .query("streaks")
      .withIndex("by_user", (q) => q.eq("userId", user))
      .first();
  },
});

export const getByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("streaks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getHighestStreakByCurrentUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);
    const user = await getDocumentOrThrow(ctx, "users", userId);
    return user.highestStreak;
  },
});
