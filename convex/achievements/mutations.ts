import { achievementDefinitions } from "../../lib/achievement-defs";
import { Id } from "../_generated/dataModel";
import { mutation, MutationCtx } from "../_generated/server";

const comparators: Record<string, (a: number, b: number) => boolean> = {
  eq: (a, b) => a === b,
  neq: (a, b) => a !== b,
  gt: (a, b) => a > b,
  gte: (a, b) => a >= b,
  lt: (a, b) => a < b,
  lte: (a, b) => a <= b,
};

function checkCondition(
  userValue: number,
  definition: { condition: string; conditionValue: string },
): boolean {
  const compare = comparators[definition.condition];

  if (!compare) {
    console.error(`Unsupported condition: ${definition.condition}`);
    throw new Error(`Unsupported condition: ${definition.condition}`);
  }

  const result = compare(userValue, Number(definition.conditionValue));
  console.log(
    `Checking condition: userValue=${userValue}, condition=${definition.condition}, ` +
      `conditionValue=${definition.conditionValue} => result=${result}`,
  );
  return result;
}

export const insertLevelAchievements = async (
  ctx: MutationCtx,
  userId: Id<"users">,
  oldLevel: number,
  newLevel: number,
) => {
  console.log(
    `Checking for level achievements for user ${userId} from level ${oldLevel} to ${newLevel}`,
  );
  const defs = await ctx.db
    .query("achievementDefinitions")
    .filter((q) => q.eq(q.field("type"), "level"))
    .collect();

  for (let level = oldLevel + 1; level <= newLevel; level++) {
    console.log(`Checking achievements for level ${level}`);
    await Promise.all(
      defs.map(async ({ _id, condition, conditionValue, title }) => {
        if (checkCondition(level, { condition, conditionValue })) {
          const alreadyHas = await ctx.db
            .query("achievements")
            .withIndex("by_definition_user", (q) =>
              q.eq("achievementDefinitionId", _id).eq("userId", userId),
            )
            .unique();

          if (!alreadyHas) {
            await ctx.db.insert("achievements", {
              achievementDefinitionId: _id,
              userId,
            });
          }
        }
      }),
    );
  }
};

export const generateAchievements = mutation({
  handler: async (ctx) => {
    await Promise.all(
      achievementDefinitions.map(async (def) => {
        const existing = await ctx.db
          .query("achievementDefinitions")
          .filter((q) => q.eq(q.field("title"), def.title))
          .first();

        if (!existing) {
          await ctx.db.insert("achievementDefinitions", def);
        }
      }),
    );
  },
});
