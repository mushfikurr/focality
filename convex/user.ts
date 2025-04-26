import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getTodayDayNumber } from "./utils/date";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
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
