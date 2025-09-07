import { Id } from "./_generated/dataModel";
import { getTodayDayNumber } from "./utils/date";

export const updateLastActive = async (ctx: any, userId: Id<"users">) => {
  const user = await ctx.db.get(userId);
  if (!user) return;
  await ctx.db.patch(userId, {
    lastActive: getTodayDayNumber(),
  });
};
