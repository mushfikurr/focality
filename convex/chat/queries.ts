import { v } from "convex/values";
import { query } from "../_generated/server";

export const listChatMessages = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session?.roomId) return [];

    const room = await ctx.db.get(session.roomId);
    if (!room) return [];

    const messages = await ctx.db
      .query("chats")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();

    // Add user information to each message
    const messagesWithSenders = await Promise.all(
      messages.map(async (message) => {
        const user = await ctx.db.get(message.userId);
        return {
          ...message,
          sender: user,
        };
      }),
    );

    return messagesWithSenders;
  },
});
