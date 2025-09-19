import { Id } from "../_generated/dataModel";
import { query, QueryCtx } from "../_generated/server";
import { betterAuthComponent } from "../auth";

export const getAchievementsForUser = async (
  ctx: QueryCtx,
  userId: Id<"users">,
) => {
  const achievements = await ctx.db
    .query("achievements")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
  const definitions = await Promise.all(
    achievements.filter(Boolean).map(async (a) => {
      const def = await ctx.db.get(a.achievementDefinitionId);
      return def;
    }),
  );
  return definitions;
};

export const getAchievementsForCurrentUser = query({
  handler: async (ctx) => {
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) throw new Error("User not authenticated");

    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const userId = user._id;
    const achievements = await getAchievementsForUser(ctx, userId);
    return achievements;
  },
});
