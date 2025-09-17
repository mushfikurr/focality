import { v } from "convex/values";
import { query } from "../_generated/server";

export const listChatMessages = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chats")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
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
