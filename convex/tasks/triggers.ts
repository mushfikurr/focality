import {
  internalMutation as rawInternalMutation,
  mutation as rawMutation,
  MutationCtx,
} from "../_generated/server";
import { DataModel, Doc } from "../_generated/dataModel";
import { Triggers } from "convex-helpers/server/triggers";
import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { getDocumentOrThrow } from "../utils/db";
import { incrementStreak } from "../streaks/mutations";
import { getLevelFromXP } from "../levels/utils";
import { Id } from "../_generated/dataModel";
import { insertLevelAchievements } from "../achievements/mutations";
import { grantExperience } from "../levels/mutations";
import { durationByUserAggregate } from "../statistics/tasks/queries";

const triggers = new Triggers<DataModel>();

triggers.register("tasks", async (ctx, { oldDoc, newDoc }) => {
  if (!oldDoc && newDoc) {
    await durationByUserAggregate.insert(ctx, newDoc);
  } else if (oldDoc && newDoc) {
    await durationByUserAggregate.replace(ctx, oldDoc, newDoc);
  } else if (oldDoc && !newDoc) {
    await durationByUserAggregate.deleteIfExists(ctx, oldDoc);
  }

  if (newDoc && (!oldDoc || !oldDoc.completed) && newDoc.completed) {
    await onTaskComplete(ctx, newDoc);
  }
});

// Fire all events when a task is complete:
// - Increment streaks
// - Grant experience
// - Check for any achievements gained
export const onTaskComplete = async (
  ctx: MutationCtx,
  newDoc: Doc<"tasks">,
) => {
  const session = await ctx.db.get(newDoc.sessionId);
  if (!session) return;
  // Add streaks and XP for all participants
  if (session) {
    await Promise.all(
      session.participants.map(async (userId: Id<"users">) => {
        const user = await getDocumentOrThrow(ctx, "users", userId);
        const oldLevel = getLevelFromXP(user.xp ?? 0);

        await incrementStreak(ctx, userId);
        await grantExperience(ctx, userId, newDoc.duration);

        const newUser = await getDocumentOrThrow(ctx, "users", userId);
        const newLevel = getLevelFromXP(newUser.xp ?? 0);

        if (newLevel > oldLevel) {
          console.log(
            `User ${userId} leveled up from ${oldLevel} to ${newLevel}`,
          );
          await insertLevelAchievements(ctx, userId, oldLevel, newLevel);
        }
      }),
    );
  }
};

// create wrappers that replace the built-in `mutation` and `internalMutation`
// the wrappers override `ctx` so that `ctx.db.insert`, `ctx.db.patch`, etc. run registered trigger functions
export const triggerTaskMutation = customMutation(
  rawMutation,
  customCtx(triggers.wrapDB),
);
export const triggerTaskInternalMutation = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB),
);
