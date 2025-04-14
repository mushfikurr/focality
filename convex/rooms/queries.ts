import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getRoomBySession = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session?.roomId) return null;

    return await ctx.db.get(session.roomId);
  },
});

export const listParticipants = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session?.roomId) return null;

    const participants = await ctx.db
      .query("users")
      .withIndex("by_room", (q) => q.eq("roomId", session.roomId))
      .collect();

    return participants;
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

    return room;
  },
});

export const listUserRooms = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const rooms = await ctx.db
      .query("rooms")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return rooms;
  },
});

export const getRoomParticipants = query({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) return [];

    const users = await Promise.all(
      room.participants.map((id) => ctx.db.get(id)),
    );

    return users.filter(Boolean);
  },
});
