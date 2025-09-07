import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getDocumentOrThrow } from "../utils/db";
import { currentUserId } from "../auth";

export const createChat = mutation({
  args: {
    roomId: v.id("rooms"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await currentUserId(ctx);
    const room = await getDocumentOrThrow(ctx, "rooms", args.roomId);

    // Validate user is a participant in the room
    if (!room.participants.includes(userId)) {
      throw new Error(
        "You must be a participant to send messages in this room",
      );
    }

    // Get and validate session status
    const session = await getDocumentOrThrow(ctx, "sessions", room.sessionId);
    if (session.running) {
      throw new Error("Cannot send messages while session is running");
    }

    // Create the chat message
    const chatMessage = {
      roomId: args.roomId,
      userId: userId,
      content: args.content.trim(),
    };

    return await ctx.db.insert("chats", chatMessage);
  },
});

export const deleteChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const userId = await currentUserId(ctx);
    const chat = await getDocumentOrThrow(ctx, "chats", args.chatId);

    // Only message author can delete their messages
    if (chat.userId !== userId) {
      throw new Error("You can only delete your own messages");
    }

    await ctx.db.delete(args.chatId);
  },
});

export const updateChat = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await currentUserId(ctx);
    const chat = await getDocumentOrThrow(ctx, "chats", args.chatId);

    // Only message author can edit their messages
    if (chat.userId !== userId) {
      throw new Error("You can only edit your own messages");
    }

    await ctx.db.patch(args.chatId, {
      content: args.content.trim(),
    });
  },
});
