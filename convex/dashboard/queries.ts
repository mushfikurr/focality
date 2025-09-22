import { Id } from "../_generated/dataModel";
import { query, QueryCtx } from "../_generated/server";
import { authComponent } from "../auth";
import { getLevelFromXP, getXPToNextLevel } from "../levels/utils";

// Import existing helpers
import {
  totalFocusTimeByUser,
  totalFocusTimeByUserForWeek,
  getTaskStatsForUser,
} from "../statistics/tasks/queries";

import {
  totalCompletionByUser,
  totalCompletionByUserForWeek,
} from "../statistics/sessions/queries";

import { getAchievementsForUser } from "../achievements/queries";

export const getStreakInfoForUser = async (
  ctx: QueryCtx,
  userId: Id<"users">,
) => {
  const streak = await ctx.db
    .query("streaks")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
  const user = await ctx.db.get(userId);
  const highestStreak = user?.highestStreak ?? 0;
  return { streak, highestStreak };
};

export const getLevelInfoForUser = (user: any) => {
  const totalXP = user.xp ?? 0;
  const level = getLevelFromXP(totalXP);
  const toNext = getXPToNextLevel(totalXP);
  return { totalXP, level, xpToNextLevel: toNext };
};

export const getDashboardData = query({
  handler: async (ctx) => {
    const userMetadata = await authComponent.getAuthUser(ctx);
    if (!userMetadata.userId) throw new Error("User not authenticated");
    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const userId = user._id;

    const [
      taskStats,
      sessionStats,
      streakInfo,
      levelInfo,
      achievements,
      currentUser,
    ] = await Promise.all([
      (async () => {
        const totalFocusTime = await totalFocusTimeByUser(ctx, { userId });
        const totalFocusTimeByWeek = await totalFocusTimeByUserForWeek(ctx, {
          userId,
        });
        const taskStatsResult = await getTaskStatsForUser(ctx, { userId });
        return {
          totalFocusTime,
          totalFocusTimeByWeek,
          dailyAveragesByMonth: {
            totalSum: taskStatsResult.totalSum,
            totalCount: taskStatsResult.totalCount,
            dailyAverages: taskStatsResult.dailyAverages,
          },
          productivityPatterns: taskStatsResult.productivityPatterns,
        };
      })(),
      (async () => {
        const totalCompletion = await totalCompletionByUser(ctx, { userId });
        const totalCompletionByWeek = await totalCompletionByUserForWeek(ctx, {
          userId,
        });
        return { totalCompletion, totalCompletionByWeek };
      })(),
      getStreakInfoForUser(ctx, userId),
      Promise.resolve(getLevelInfoForUser(user)),
      getAchievementsForUser(ctx, userId),
      Promise.resolve(user),
    ]);

    return {
      tasks: taskStats,
      sessions: sessionStats,
      streaks: streakInfo,
      levels: levelInfo,
      achievements: achievements,
      user: currentUser,
    };
  },
});
