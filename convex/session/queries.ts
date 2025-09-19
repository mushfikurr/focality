import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { MutationCtx, query } from "../_generated/server";
import { getCurrentUser, betterAuthComponent } from "../auth";
import { getSessionExperience } from "../levels/queries";
import { getDocumentOrThrow } from "../utils/db";

const isSessionPublic = (q: any) => q.eq("visiblity", "public");

export const isUserHost = async (
  ctx: MutationCtx,
  sessionId: Id<"sessions">,
) => {
  const userMetadata = await betterAuthComponent.getAuthUser(ctx);
  if (!userMetadata) return false;

  const user = await ctx.db.get(userMetadata.userId as any);
  if (!user) return false;

  const session = await ctx.db.get(sessionId);
  if (!session) throw new Error("Session not found");

  return user._id === session.hostId;
};

export const paginatedSessionsByCurrentUser = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.id("users"),
  },
  handler: async (ctx, { paginationOpts, userId }) => {
    const results = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("hostId", userId))
      .order("desc")
      .paginate(paginationOpts);

    const formattedPage = await Promise.all(
      results.page.map(async (session) => {
        const tasks = await ctx.db
          .query("tasks")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .collect();
        const completedTasks = tasks.filter((t) => t.completed === true);

        const xpGained = await getSessionExperience(ctx, session);

        const completionPercentage = tasks.length
          ? (completedTasks.length / tasks.length) * 100
          : 0;

        const totalTime = tasks.reduce(
          (acc, task) => acc + (task.duration || 0),
          0,
        );
        const focusedTime = completedTasks.reduce(
          (acc, task) => acc + (task.duration || 0),
          0,
        );
        return {
          id: session._id,
          shareId: session.shareId,
          date: session._creationTime,
          title: session.title,
          time: {
            focusedTime,
            totalTime,
          },
          completionPercentage,
          xpGained,
        };
      }),
    );

    return { ...results, page: formattedPage };
  },
});

export const paginatedPublicSessions = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .order("desc")
      .paginate(args.paginationOpts);

    const pageWithCounts = await Promise.all(
      sessions.page.map(async (s) => {
        const participantAmount = (
          await ctx.db
            .query("users")
            .withIndex("by_session", (q) => q.eq("sessionId", s._id))
            .collect()
        ).length;
        if (participantAmount === 0) return;
        const host = await ctx.db.get(s.hostId);

        return {
          id: s._id,
          creationTime: s._creationTime,
          startTime: s.startTime,
          participantAmount,
          title: s.title,
          description: s.description,
          host,
          running: s.running,
          shareId: s.shareId,
        };
      }),
    );

    return {
      ...sessions,
      page: pageWithCounts.filter(Boolean),
    };
  },
});
export const listSessionsByCurrentUser = query({
  handler: async (ctx, args) => {
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) throw new Error("User not authenticated");

    const user = await ctx.db.get(userMetadata.userId as any);
    if (!user) throw new Error("User not found");

    const userId = user._id as Id<"users">;
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

    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) throw new Error("User not authenticated");

    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const userId = user._id;

    if (session.visibility === "private" && user?.sessionId !== session._id) {
      throw new Error("Not authorized");
    }

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

export const getSessionByShareId = query({
  args: {
    shareId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_share_id", (q) => q.eq("shareId", args.shareId))
      .first();
    if (!session) throw new Error("Session not found");

    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) throw new Error("User not authenticated");

    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const userId = user._id;
    if (session.visibility === "private" && user?.sessionId !== session._id) {
      throw new Error("Not authorized");
    }

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

export const listParticipants = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await getDocumentOrThrow(ctx, "sessions", args.sessionId);
    return await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionId", session._id))
      .collect();
  },
});

export const listUserSessions = query({
  handler: async (ctx) => {
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) throw new Error("User not authenticated");

    const user = await ctx.db.get(userMetadata.userId as any);
    if (!user) throw new Error("User not found");

    const userId = user._id;
    return await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("hostId"), userId))
      .collect();
  },
});
