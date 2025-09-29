import { v } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { query, QueryCtx } from "../_generated/server";
import { authComponent } from "../auth";
import { getDocumentOrThrow } from "../utils/db";
import {
  getLevelFromXP,
  getXPGainFromDuration,
  getXPToNextLevel,
} from "./utils";

export const getLevelInfo = query({
  handler: async (ctx) => {
    // Get current user safely
    const userMetadata = await authComponent.safeGetAuthUser(ctx);
    if (!userMetadata) return null;
    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) return null;

    const userId = user._id;

    const totalXP = user.xp ?? 0;
    const level = getLevelFromXP(totalXP);
    const toNext = getXPToNextLevel(totalXP);

    return { totalXP, level, xpToNextLevel: toNext };
  },
});

export const getSessionExperience = async (
  ctx: QueryCtx,
  session: Doc<"sessions">,
) => {
  const completedTasks = await ctx.db
    .query("tasks")
    .withIndex("by_session", (q) => q.eq("sessionId", session._id))
    .filter((q) => q.eq(q.field("completed"), true))
    .collect();
  const totalXp = completedTasks.reduce((acc, task) => {
    return acc + getXPGainFromDuration(task.duration || 0);
  }, 0);
  return totalXp;
};

export const getTaskExperience = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await getDocumentOrThrow(ctx, "tasks", args.taskId);
    return getXPGainFromDuration(task.duration);
  },
});
