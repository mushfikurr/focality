import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { MutationCtx, query } from "../_generated/server";
import { getSessionExperience } from "../levels/queries";
import { authenticatedUser } from "../utils/auth";
import { getCurrentUserId } from "../user";

const isSessionPublic = (q: any) => q.eq("visiblity", "public");

export const isUserHost = async (
  ctx: MutationCtx,
  sessionId: Id<"sessions">,
) => {
  const userId = await authenticatedUser(ctx);
  const session = await ctx.db.get(sessionId);
  if (!session) throw new Error("Session not found");
  if (!userId) throw new Error("User not found");

  return userId === session.hostId;
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

export const listAllSessions = query({
  args: { userId: v.id("users") },
  handler: async (ctx) => {
    await authenticatedUser(ctx);
    const sessions = await ctx.db
      .query("sessions")
      .filter((q) => isSessionPublic(q))
      .order("asc")
      .collect();

    return sessions;
  },
});

export const listSessionsByCurrentUser = query({
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);
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

    const userId = await getCurrentUserId(ctx);
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
