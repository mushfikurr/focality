import { v } from "convex/values";
import { query } from "../_generated/server";
import { authenticatedUser } from "../utils/auth";
import { getDocumentOrThrow } from "../utils/db";

export const getRoomBySession = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await getDocumentOrThrow(
      ctx,
      "sessions",
      args.sessionId,
      "Session not found",
    );
    if (!session.roomId) return null;

    return await getDocumentOrThrow(
      ctx,
      "rooms",
      session.roomId,
      "Room not found",
    );
  },
});

export const listParticipants = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await getDocumentOrThrow(ctx, "sessions", args.sessionId);
    if (!session.roomId) return [];

    return await ctx.db
      .query("users")
      .withIndex("by_room", (q) => q.eq("roomId", session.roomId))
      .collect();
  },
});

export const getRoomByShareId = query({
  args: {
    shareId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_shareId", (q) => q.eq("shareId", args.shareId))
      .first();

    return room ?? null;
  },
});

export const listUserRooms = query({
  handler: async (ctx) => {
    const userId = await authenticatedUser(ctx);

    return await ctx.db
      .query("rooms")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getRoomParticipants = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await getDocumentOrThrow(ctx, "rooms", args.roomId);

    const users = await Promise.all(
      room.participants.map(async (id) => {
        const user = await ctx.db.get(id);
        if (!user) throw new Error(`User ${id} not found`);
        return user;
      }),
    );

    return users;
  },
});
