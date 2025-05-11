import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { getDocumentOrThrow } from "../utils/db";
import { getXPGainFromDuration } from "./utils";

export const grantExperience = async (
  ctx: MutationCtx,
  userId: Id<"users">,
  durationMillis: number,
) => {
  const user = await getDocumentOrThrow(ctx, "users", userId);

  const xpGain = getXPGainFromDuration(durationMillis);

  if (xpGain === 0) return { xpGain: 0 };

  await ctx.db.patch(user._id, {
    xp: (user.xp ?? 0) + xpGain,
  });

  return { xpGain };
};
