import { WithoutSystemFields } from "convex/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { mutation, MutationCtx } from "../_generated/server";
import { completionByUserAggregate } from "../statistics/sessions/queries";
import { authenticatedUser, validateSessionHost } from "../utils/auth";
import { getDocumentOrThrow } from "../utils/db";
import { incrementStreak } from "../streaks/mutations";

const _insertSession = async (
  ctx: MutationCtx,
  args: WithoutSystemFields<Doc<"sessions">>,
) => {
  const id = await ctx.db.insert("sessions", args);
  const doc = await getDocumentOrThrow(ctx, "sessions", id);
  await completionByUserAggregate.insert(ctx, doc);
  return doc._id;
};

const _updateSession = async (
  ctx: MutationCtx,
  id: Id<"sessions">,
  args: Partial<WithoutSystemFields<Doc<"sessions">>>,
) => {
  const oldDoc = await getDocumentOrThrow(ctx, "sessions", id);
  console.log(oldDoc);
  await ctx.db.patch(id, args);
  const newDoc = await getDocumentOrThrow(ctx, "sessions", id);
  await completionByUserAggregate.replace(ctx, oldDoc, newDoc);
};

const _removeSession = async (ctx: MutationCtx, id: Id<"sessions">) => {
  const doc = await getDocumentOrThrow(ctx, "sessions", id);
  await ctx.db.delete(id);
  await completionByUserAggregate.deleteIfExists(ctx, doc);
};

const setCurrentTask = (
  ctx: MutationCtx,
  sessionId: Id<"sessions">,
  taskId: Id<"tasks">,
) => {
  return _updateSession(ctx, sessionId, { currentTaskId: taskId });
};

const clearCurrentTask = (ctx: MutationCtx, sessionId: Id<"sessions">) => {
  return _updateSession(ctx, sessionId, { currentTaskId: undefined });
};

export const incrementStreakForAllUsers = async (
  ctx: MutationCtx,
  sessionId: Id<"sessions">,
) => {
  const session = await getDocumentOrThrow(ctx, "sessions", sessionId);
  const userIds = session.userIds;
  for (const userId of userIds) {
    await incrementStreak(ctx, userId);
  }
};

export const findAndSetCurrentTask = async (
  ctx: MutationCtx,
  sessionId: Id<"sessions">,
) => {
  const session = await getDocumentOrThrow(ctx, "sessions", sessionId);
  if (session.currentTaskId) {
    const currentTask = await ctx.db.get(session.currentTaskId);
    if (currentTask && !currentTask.completed) {
      console.log("✅ currentTaskId is still valid:", currentTask._id);
      return currentTask;
    } else {
      console.log("⚠️ currentTaskId is stale or completed. Finding new task.");
    }
  }

  // Find the next incomplete task
  const nextTask = await ctx.db
    .query("tasks")
    .withIndex("by_session", (q) => q.eq("sessionId", session._id))
    .filter((q) => q.eq(q.field("completed"), false))
    .order("asc")
    .first();

  if (!nextTask) {
    console.log("❌ No incomplete tasks available.");
    await clearCurrentTask(ctx, session._id);
    await _updateSession(ctx, session._id, { completed: true });
    return null;
  }

  console.log("✅ Found next task:", nextTask._id);

  await setCurrentTask(ctx, session._id, nextTask._id);

  return nextTask;
};

export const createSession = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    tasks: v.optional(v.array(v.id("tasks"))),
    visibility: v.union(v.literal("public"), v.literal("private")),
  },
  handler: async (ctx, args) => {
    const userId = await authenticatedUser(ctx);

    const session = {
      hostId: userId,
      userIds: [userId],
      running: false,
      title: args.title,
      description: args.description,
      startTime: undefined,
      currentTaskId: undefined,
      roomId: undefined,
      completed: false,
    };

    const sessionId = await _insertSession(ctx, session);

    const room = {
      sessionId,
      userId,
      title: args.title,
      participants: [userId],
      shareId: generateUniqueShareId(),
    } satisfies WithoutSystemFields<Doc<"rooms">>;

    const roomId = await ctx.db.insert("rooms", room);

    await _updateSession(ctx, sessionId, { roomId: roomId });

    return sessionId;
  },
});

function generateUniqueShareId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const startSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await validateSessionHost(ctx, args.sessionId);
    const session = await getDocumentOrThrow(ctx, "sessions", args.sessionId);

    if (!session.startTime) {
      await _updateSession(ctx, args.sessionId, {
        startTime: new Date().toISOString(),
      });

      console.log("start time for session is now", session.startTime);
    }

    return await _updateSession(ctx, args.sessionId, { running: true });
  },
});

export const pauseSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await validateSessionHost(ctx, args.sessionId);
    const session = await getDocumentOrThrow(ctx, "sessions", args.sessionId);

    if (session.currentTaskId && session.startTime) {
      const startTime = new Date(session.startTime);
      const now = new Date();
      const elapsedTime = now.getTime() - startTime.getTime();

      console.log("elapsed time for current task is now", elapsedTime);

      const currentTask = await ctx.db.get(session.currentTaskId);

      await ctx.runMutation(internal.tasks.mutations._updateTask, {
        id: session.currentTaskId,
        args: {
          elapsed: (currentTask?.elapsed ?? 0) + elapsedTime,
        },
      });
    }

    await _updateSession(ctx, args.sessionId, {
      running: false,
      startTime: undefined,
    });
  },
});

export const resetSessionTimer = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await validateSessionHost(ctx, args.sessionId);
    const session = await getDocumentOrThrow(ctx, "sessions", args.sessionId);

    if (session.currentTaskId) {
      const currentTask = await ctx.db.get(session.currentTaskId);
      if (currentTask) {
        await ctx.runMutation(internal.tasks.mutations._updateTask, {
          id: currentTask._id,
          args: { elapsed: 0 },
        });
        await _updateSession(ctx, args.sessionId, { startTime: undefined });
      }
    }
    await _updateSession(ctx, args.sessionId, { running: false });
  },
});

export const deleteSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await validateSessionHost(ctx, args.sessionId);
    await getDocumentOrThrow(ctx, "sessions", args.sessionId);

    await _removeSession(ctx, args.sessionId);
  },
});
