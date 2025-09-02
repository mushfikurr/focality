import { v } from "convex/values";
import { api } from "../_generated/api";
import { query } from "../_generated/server";
import { currentUser } from "../auth";

export const taskType = v.union(v.literal("task"), v.literal("break"));

export const listTasks = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const user = await currentUser(ctx);
    console.log(user);
    if (!user) throw new Error("Not authenticated");

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
    const user = await currentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const task = await ctx.db
      .query("tasks")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .filter((q) => q.eq("type", args.type))
      .order("asc")
      .first();
    return task;
  },
});
