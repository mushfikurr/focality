import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { mutation, MutationCtx } from "../_generated/server";

async function sendMessageHelper(
  ctx: MutationCtx,
  args: { userId: Id<"users">; roomId: Id<"rooms">; content: string },
) {
  const room = await ctx.db.get(args.roomId);
  if (!room?.participants.includes(args.userId)) {
    throw new Error("Not in room");
  }

  return await ctx.db.insert("chats", {
    roomId: args.roomId,
    userId: args.userId,
    content: args.content,
  });
}

export const createChat = mutation({
  args: {
    roomId: v.id("rooms"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    
    const session = await ctx.db.get(room.sessionId);
    if (!session) throw new Error("Session not found");

    if (session.running)
      throw new Error("Session is running. Chat is disabled");

    await sendMessageHelper(ctx, { userId: userId, ...args });
  },
});
