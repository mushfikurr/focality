import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "../_generated/api";

export const joinRoom = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not found");

    if (room.participants.includes(userId)) return;

    await ctx.db.patch(args.roomId, {
      participants: [...room.participants, userId],
    });
  },
});
