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

export const onTaskComplete = async (
  ctx: MutationCtx,
  newDoc: Doc<"tasks">,
) => {
  const session = await ctx.db.get(newDoc.sessionId);
  if (!session) return;

  if (session) {
    const participants = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionId", session._id))
      .collect();

    await Promise.all(
      participants.map(async (user) => {
        const oldLevel = getLevelFromXP(user.xp ?? 0);

        await incrementStreak(ctx, user._id);
        await grantExperience(ctx, user._id, newDoc.duration);

        const newUser = await getDocumentOrThrow(ctx, "users", user._id);
        const newLevel = getLevelFromXP(newUser.xp ?? 0);

        if (newLevel > oldLevel) {
          console.log(
            `User ${user._id} leveled up from ${oldLevel} to ${newLevel}`,
          );
          await insertLevelAchievements(ctx, user._id, oldLevel, newLevel);
        }
      }),
    );
  }
};

export const triggerTaskMutation = customMutation(
  rawMutation,
  customCtx(triggers.wrapDB),
);
export const triggerTaskInternalMutation = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB),
);
