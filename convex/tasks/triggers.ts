import { mutation as rawMutation, internalMutation as rawInternalMutation, MutationCtx } from "../_generated/server";
import { DataModel, Doc } from "../_generated/dataModel";
import { Triggers } from "convex-helpers/server/triggers";
import { customCtx, customMutation } from "convex-helpers/server/customFunctions";
import { getDocumentOrThrow } from "../utils/db";
import { incrementStreak } from "../streaks/mutations";
import { insertLevelAchievements } from "../achievements/mutations";
import { grantExperience } from "../levels/mutations";

const triggers = new Triggers<DataModel>();

triggers.register("tasks", async (ctx, change) => {
  if (!change.newDoc || !change.oldDoc) return;
  if (change.newDoc.completed) {
    onTaskComplete(ctx, change.newDoc);
  }
});

// Fire all events when a task is complete:
// - Increment streaks
// - Grant experience
// - Check for any achievements gained
export const onTaskComplete = async (ctx: MutationCtx, newDoc: Doc<"tasks">) => {
  const session = await ctx.db.get(newDoc.sessionId);
  if (!session) return;
  // Add streaks and XP for all participants
  if (session._id && session.roomId) {
    const room = await getDocumentOrThrow(ctx, "rooms", session.roomId);
    await Promise.all(
      room.participants.map(async (userId) => {
        await incrementStreak(ctx, userId);
        await grantExperience(ctx, userId, newDoc.duration);
        await insertLevelAchievements(ctx, userId);
      }),
    );
  }

}


// create wrappers that replace the built-in `mutation` and `internalMutation`
// the wrappers override `ctx` so that `ctx.db.insert`, `ctx.db.patch`, etc. run registered trigger functions
export const triggerTaskMutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const triggerTaskInternalMutation = customMutation(rawInternalMutation, customCtx(triggers.wrapDB));
