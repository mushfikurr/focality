import { Id } from "../_generated/dataModel";
import { mutation, MutationCtx } from "../_generated/server";
import { getDocumentOrThrow } from "../utils/db";
import { getLevelFromXP } from "../levels/utils";
import { achievementDefinitions } from "../../lib/achievement-defs";

const comparators: Record<string, (a: number, b: number) => boolean> = {
  eq: (a, b) => a === b,
  neq: (a, b) => a !== b,
  gt: (a, b) => a > b,
  gte: (a, b) => a >= b,
  lt: (a, b) => a < b,
  lte: (a, b) => a <= b,
}

function checkCondition(
  userValue: number,
  definition: { condition: string; conditionValue: string }
): boolean {
  const compare = comparators[definition.condition];

  if (!compare) {
    console.error(`Unsupported condition: ${definition.condition}`);
    throw new Error(`Unsupported condition: ${definition.condition}`);
  }

  const result = compare(userValue, Number(definition.conditionValue));
  console.log(
    `Checking condition: userValue=${userValue}, condition=${definition.condition}, ` +
    `conditionValue=${definition.conditionValue} => result=${result}`
  );
  return result;
}

export const insertLevelAchievements = async (ctx: MutationCtx, userId: Id<"users">) => {
  const defs = await ctx.db.query("achievementDefinitions")
    .filter(q => q.eq(q.field("type"), "level"))
    .collect();
  console.log(`Fetched ${defs.length} level achievement definitions.`);

  const user = await getDocumentOrThrow(ctx, "users", userId);
  if (!user.xp) return;
  const userLevel = getLevelFromXP(user.xp)
  console.log(`User ${userId} has level: ${userLevel}`);

  await Promise.all(defs.map(async ({ _id, condition, conditionValue, title }) => {
    if (userLevel && checkCondition(userLevel, { condition, conditionValue })) {
      console.log(`Inserting achievement "${title}" (_id: ${_id}) for user ${userId}`);
      await ctx.db.insert("achievements", { achievementDefinitionId: _id, userId });
    } else {
      console.log(`User ${userId} does NOT meet condition for "${title}" (_id: ${_id})`);
    }
  }));
}


export const generateAchievements = mutation({
  handler: async (ctx) => {
    await Promise.all(
      achievementDefinitions.map(async (def) => {
        const existing = await ctx.db
          .query("achievementDefinitions")
          .filter(q => q.eq(q.field("title"), def.title))
          .first();

        if (!existing) {
          await ctx.db.insert("achievementDefinitions",
            def);
        }
      })
    );
  }
});
