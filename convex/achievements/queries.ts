import { Id } from "../_generated/dataModel";
import { query, QueryCtx } from "../_generated/server";
import { authenticatedUser } from "../utils/auth";

export const getAchievementsForUser = async (ctx: QueryCtx, userId: Id<"users">) => {
  const achievements = await ctx.db.query("achievements").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
  const definitions = await Promise.all(
    achievements.filter(Boolean).map(async (a) => {
      const def = await ctx.db.get(a.achievementDefinitionId);
      return def;
    })
  );
  return definitions;
}

export const getAchievementsForCurrentUser = query({
  handler: async (ctx) => {
    const user = await authenticatedUser(ctx);
    const achievements = await getAchievementsForUser(ctx, user);
    return achievements;
  }
})
