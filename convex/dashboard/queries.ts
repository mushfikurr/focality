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
  return { streak: streak || null, highestStreak };
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
        try {
          const totalFocusTime = await totalFocusTimeByUser(ctx, { userId });
          const totalFocusTimeByWeek = await totalFocusTimeByUserForWeek(ctx, {
            userId,
          });
          const taskStatsResult = await getTaskStatsForUser(ctx, { userId });
          return {
            totalFocusTime: totalFocusTime || 0,
            totalFocusTimeByWeek: totalFocusTimeByWeek || 0,
            dailyAveragesByMonth: {
              totalSum: taskStatsResult?.totalSum || 0,
              totalCount: taskStatsResult?.totalCount || 0,
              dailyAverages: taskStatsResult?.dailyAverages || [],
            },
            productivityPatterns: taskStatsResult?.productivityPatterns || {
              mostProductiveHour: null,
              mostProductiveDay: null,
            },
          };
        } catch (e) {
          console.error("Task stats error:", e);
          return {
            totalFocusTime: 0,
            totalFocusTimeByWeek: 0,
            dailyAveragesByMonth: {
              totalSum: 0,
              totalCount: 0,
              dailyAverages: [],
            },
            productivityPatterns: {
              mostProductiveHour: null,
              mostProductiveDay: null,
            },
          };
        }
      })(),
      (async () => {
        try {
          const totalCompletion = await totalCompletionByUser(ctx, { userId });
          const totalCompletionByWeek = await totalCompletionByUserForWeek(
            ctx,
            {
              userId,
            },
          );
          return {
            totalCompletion: totalCompletion || 0,
            totalCompletionByWeek: totalCompletionByWeek || 0,
          };
        } catch (e) {
          console.error("Session stats error:", e);
          return { totalCompletion: 0, totalCompletionByWeek: 0 };
        }
      })(),
      (async () => {
        try {
          const info = await getStreakInfoForUser(ctx, userId);
          return info || { streak: null, highestStreak: 0 };
        } catch (e) {
          console.error("Streak info error:", e);
          return { streak: null, highestStreak: 0 };
        }
      })(),
      Promise.resolve(
        getLevelInfoForUser(user) || { totalXP: 0, level: 1, xpToNextLevel: 0 },
      ),
      (async () => {
        try {
          const ach = await getAchievementsForUser(ctx, userId);
          return ach || [];
        } catch (e) {
          console.error("Achievements error:", e);
          return [];
        }
      })(),
      Promise.resolve(user),
    ]);

    return {
      tasks: taskStats || {},
      sessions: sessionStats || {},
      streaks: streakInfo || { streak: null, highestStreak: 0 },
      levels: levelInfo || { totalXP: 0, level: 1, xpToNextLevel: 0 },
      achievements: achievements || [],
      user: currentUser || null,
    };
  },
});
