import { v } from "convex/values";
import { query } from "../_generated/server";
import { authenticatedUser } from "../utils/auth";
import { getDocumentOrThrow } from "../utils/db";
import {
  getLevelFromXP,
  getXPGainFromDuration,
  getXPToNextLevel,
} from "./utils";

export const getLevelInfo = query({
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);
    const user = await getDocumentOrThrow(ctx, "users", userId);

    const totalXP = user.xp ?? 0;
    const level = getLevelFromXP(totalXP);
    const toNext = getXPToNextLevel(totalXP);

    return { totalXP, level, xpToNextLevel: toNext };
  },
});

export const getTaskExperience = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await getDocumentOrThrow(ctx, "tasks", args.taskId);
    return getXPGainFromDuration(task.duration);
  },
});
