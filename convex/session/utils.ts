import { generate } from "memorable-ids";
import { MutationCtx } from "../_generated/server";

const MAX_UNIQUE_ID_ATTEMPTS = 5;

export const generateUniqueShareId = async (ctx: MutationCtx) => {
  for (let i = 0; i < MAX_UNIQUE_ID_ATTEMPTS; i++) {
    const candidate = generate({});

    const existing = await ctx.db
      .query("sessions")
      .withIndex("by_share_id", (q) => q.eq("shareId", candidate))
      .first();

    if (!existing) {
      return candidate;
    }
  }

  throw new Error("Failed to generate unique share ID after retries");
};
