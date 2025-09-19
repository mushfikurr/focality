import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { getDocumentOrThrow } from "../utils/db";
import { betterAuthComponent } from "../auth";

export const createChat = mutation({
  args: {
    sessionId: v.id("sessions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) throw new Error("User not authenticated");

    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const userId = user._id as Id<"users">;
    const session = await getDocumentOrThrow(ctx, "sessions", args.sessionId);

    const userDoc = await getDocumentOrThrow(ctx, "users", userId);
    if (userDoc.sessionId !== session._id) {
      throw new Error(
        "You must be a participant to send messages in this session",
      );
    }

    if (session.running) {
      throw new Error("Cannot send messages while session is running");
    }

    const chatMessage = {
      sessionId: args.sessionId,
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
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) throw new Error("User not authenticated");

    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const userId = user._id as Id<"users">;
    const chat = await getDocumentOrThrow(ctx, "chats", args.chatId);

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
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) throw new Error("User not authenticated");

    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const userId = user._id as Id<"users">;
    const chat = await getDocumentOrThrow(ctx, "chats", args.chatId);

    if (chat.userId !== userId) {
      throw new Error("You can only edit your own messages");
    }

    await ctx.db.patch(args.chatId, {
      content: args.content.trim(),
    });
  },
});
