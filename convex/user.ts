import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getTodayDayNumber } from "./utils/date";
import { betterAuthComponent } from "./auth";

export const getCurrentUserId = async (ctx: any) => {
  const userId = (await betterAuthComponent.getAuthUserId(ctx)) as Id<"users">;
  if (userId === null) {
    throw new Error("User not found");
  }
  return userId;
};

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    return await ctx.db.get(userId);
  },
});

export const updateLastActive = async (ctx: any, userId: Id<"users">) => {
  const user = await ctx.db.get(userId);
  if (!user) return;
  await ctx.db.patch(userId, {
    lastActive: getTodayDayNumber(),
  });
};
