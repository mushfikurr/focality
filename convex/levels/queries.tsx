import { v } from "convex/values";
import { MutationCtx, query, QueryCtx } from "../_generated/server";
import { authenticatedUser } from "../utils/auth";
import { getDocumentOrThrow } from "../utils/db";
import {
  getLevelFromXP,
  getXPGainFromDuration,
  getXPToNextLevel,
} from "./utils";
import { Doc } from "../_generated/dataModel";

export const getLevelInfo = query({
  handler: async (ctx) => {
    const userId = await authenticatedUser(ctx);
    const user = await getDocumentOrThrow(ctx, "users", userId);

    const totalXP = user.xp ?? 0;
    const level = getLevelFromXP(totalXP);
    const toNext = getXPToNextLevel(totalXP);

    return { totalXP, level, xpToNextLevel: toNext };
  },
});

export const getSessionExperience = async (ctx: QueryCtx, session: Doc<"sessions">) => {
  const tasks = await ctx.db.query("tasks").withIndex("by_session", (q) => q.eq("sessionId", session._id)).collect();
  const sumDurationInMs = tasks.reduce((acc, task) => acc + (task.duration || 0), 0);
  return getXPGainFromDuration(sumDurationInMs);
}

export const getTaskExperience = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await getDocumentOrThrow(ctx, "tasks", args.taskId);
    return getXPGainFromDuration(task.duration);
  },
});
