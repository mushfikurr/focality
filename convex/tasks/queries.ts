import { v } from "convex/values";
import { api } from "../_generated/api";
import { query } from "../_generated/server";
import { authComponent } from "../auth";

export const taskType = v.union(v.literal("task"), v.literal("break"));

export const listTasks = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const userMetadata = await authComponent.safeGetAuthUser(ctx);
    if (!userMetadata) throw new Error("User not authenticated");

    const user = await ctx.db.get(userMetadata.userId as any);
    if (!user) throw new Error("User not found");

    console.log(user);

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();

    return tasks;
  },
});

export const getCurrentTaskCandidate = query({
  args: {
    sessionId: v.id("sessions"),
    type: v.union(v.literal("task"), v.literal("break")),
  },
  handler: async (ctx, args) => {
    const userMetadata = await authComponent.safeGetAuthUser(ctx);
    if (!userMetadata) throw new Error("User not authenticated");

    const user = await ctx.db.get(userMetadata.userId as any);
    if (!user) throw new Error("User not found");

    const task = await ctx.db
      .query("tasks")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .filter((q) => q.eq("type", args.type))
      .order("asc")
      .first();
    return task;
  },
});
