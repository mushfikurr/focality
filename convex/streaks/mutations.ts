import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { updateLastActive } from "../user";
import { getTodayDayNumber } from "../utils/date";
import { getDocumentOrThrow } from "../utils/db";

export async function startStreak(ctx: MutationCtx, user: Doc<"users">) {
  const streak = await ctx.db
    .query("streaks")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .first();

  if (!streak) {
    await ctx.db.insert("streaks", {
      streak: 1,
      userId: user._id,
    });
    if (!user.highestStreak) {
      await ctx.db.patch(user._id, {
        highestStreak: 1,
      });
    }
  }
}

export async function incrementStreak(ctx: MutationCtx, userId: Id<"users">) {
  const today = getTodayDayNumber();

  const user = await getDocumentOrThrow(ctx, "users", userId);
  const streak = await ctx.db
    .query("streaks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();

  if (!streak) {
    await startStreak(ctx, user);
    return;
  }

  if (!user.lastActive) {
    // First time ever being active
    await updateLastActive(ctx, userId);
    return;
  }

  if (user.lastActive === today) {
    // Already active today, nothing to do
    return;
  }

  let newStreak = 1;
  if (user.lastActive === today - 1) {
    // Active yesterday → continue streak
    newStreak = streak.streak + 1;
  }

  // Update streak count
  await ctx.db.patch(streak._id, {
    streak: newStreak,
  });

  // Update user's highest streak if needed
  if (!user.highestStreak || newStreak > user.highestStreak) {
    await ctx.db.patch(userId, {
      highestStreak: newStreak,
    });
  }

  // Always update last active to today
  await updateLastActive(ctx, userId);
}
