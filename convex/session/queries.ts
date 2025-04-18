import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, MutationCtx, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";

const isSessionPublic = (q: any) => q.eq("visiblity", "public");

export const isUserAuthenticated = async (ctx: MutationCtx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
};

export const isUserHost = async (
  ctx: MutationCtx,
  sessionId: Id<"sessions">,
) => {
  const userId = await isUserAuthenticated(ctx);
  const session = await ctx.db.get(sessionId);
  if (!session) throw new Error("Session not found");
  if (!userId) throw new Error("User not found");

  return userId === session.hostId;
};

export const listSessions = query({
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const sessions = await ctx.db
      .query("sessions")
      .filter((q) => isSessionPublic(q))
      .order("asc")
      .collect();

    return sessions;
  },
});

export const listSessionsByUser = query({
  handler: async (ctx, args) => {
    const userId = (await getAuthUserId(ctx)) as Id<"users">;
    if (!userId) throw new Error("Not authenticated");

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("hostId", userId))
      .order("asc")
      .collect();

    return sessions;
  },
});

export const getCurrentTask = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    if (!session.currentTaskId) return undefined;

    const task = await ctx.db.get(session.currentTaskId);
    return task;
  },
});

export const getSession = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    const userId = await getAuthUserId(ctx);
    const isRoomPrivate = session.roomId === null;
    if (isRoomPrivate && session.hostId !== userId)
      throw new Error("Not authorized");

    const currentTask = session.currentTaskId
      ? await ctx.db.get(session.currentTaskId)
      : undefined;

    return {
      session: {
        ...session,
      },
      currentTask,
    };
  },
});

export const getDriftTimeForSession = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    const dateNow = new Date().toISOString();
    return dateNow;
  },
});
