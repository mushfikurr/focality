import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { api } from "../_generated/api";
import { validateRoomParticipant, authenticatedUser } from "../utils/auth";
import { getDocumentOrThrow } from "../utils/db";

export const joinRoom = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);
    const room = await getDocumentOrThrow(ctx, "rooms", args.roomId);

    if (room.participants.includes(userId)) return;

    await ctx.db.patch(args.roomId, {
      participants: [...room.participants, userId],
    });
  },
});

export const leaveRoom = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);
    const room = await getDocumentOrThrow(ctx, "rooms", args.roomId);

    if (!room.participants.includes(userId)) return;

    await ctx.db.patch(args.roomId, {
      participants: room.participants.filter((id) => id !== userId),
    });
  },
});

export const deleteRoom = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);
    const room = await getDocumentOrThrow(ctx, "rooms", args.roomId);

    if (room.userId !== userId) {
      throw new Error("Only room owner can delete the room");
    }

    // Delete all chat messages in the room
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    for (const chat of chats) {
      await ctx.db.delete(chat._id);
    }

    // Delete the room
    await ctx.db.delete(args.roomId);
  },
});

export const updateRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);
    const room = await getDocumentOrThrow(ctx, "rooms", args.roomId);

    if (room.userId !== userId) {
      throw new Error("Only room owner can update the room");
    }

    await ctx.db.patch(args.roomId, {
      title: args.title,
    });
  },
});
