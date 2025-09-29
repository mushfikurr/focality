import { WithoutSystemFields } from "convex/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { mutation, MutationCtx } from "../_generated/server";
import { authComponent } from "../auth";
import { completionByUserAggregate } from "../statistics/sessions/queries";
import { incrementStreak } from "../streaks/mutations";
import { getDocumentOrThrow } from "../utils/db";
import { generateUniqueShareId } from "./utils";

const _insertSession = async (
  ctx: MutationCtx,
  args: WithoutSystemFields<Doc<"sessions">>,
) => {
  const id = await ctx.db.insert("sessions", args);
  const doc = await getDocumentOrThrow(ctx, "sessions", id);
  await completionByUserAggregate.insert(ctx, doc);
  return { id: doc._id, shareId: doc.shareId };
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
  const users = await ctx.db
    .query("users")
    .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
    .collect();
  const userIds = users.map((u) => u._id);
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
    const userMetadata = await authComponent.safeGetAuthUser(ctx);
    if (!userMetadata) return null;
    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) return null;

    const userId = user._id;
    const uniqueShareId = await generateUniqueShareId(ctx);

    const session = {
      hostId: userId,
      running: false,
      title: args.title,
      description: args.description,
      startTime: undefined,
      visibility: args.visibility,
      currentTaskId: undefined,
      completed: false,
      shareId: uniqueShareId,
    };

    const { shareId } = await _insertSession(ctx, session);
    return shareId;
  },
});

export async function getSession(ctx: MutationCtx, sessionId: Id<"sessions">) {
  const session = await getDocumentOrThrow(ctx, "sessions", sessionId);

  const userMetadata = await authComponent.safeGetAuthUser(ctx);
  if (!userMetadata) return null;

  const user = await ctx.db.get(userMetadata.userId as Id<"users">);
  if (!user) throw new Error("User not found");

  if (session.hostId !== user._id) {
    throw new Error("You are not the host of this session.");
  }
  return session;
}

export const startSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await getSession(ctx, args.sessionId);
    if (!session) return null;
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
    const session = await getSession(ctx, args.sessionId);
    if (!session) return null;

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
    const session = await getSession(ctx, args.sessionId);
    if (!session) return null;

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
    const session = await getSession(ctx, args.sessionId);
    if (!session) return null;

    const users = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    for (const user of users) {
      await ctx.db.patch(user._id, { sessionId: undefined });
    }

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    for (const chat of chats) {
      await ctx.db.delete(chat._id);
    }

    await _removeSession(ctx, session._id);
  },
});

export const joinSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, { sessionId }) => {
    const session = await getDocumentOrThrow(ctx, "sessions", sessionId);

    const userMetadata = await authComponent.safeGetAuthUser(ctx);
    if (!userMetadata) return null;
    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) return null;

    await ctx.db.patch(user._id, {
      sessionId,
    });
  },
});

export const leaveSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const userMetadata = await authComponent.safeGetAuthUser(ctx);
    if (!userMetadata) return null;
    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) return null;

    const session = await getDocumentOrThrow(ctx, "sessions", args.sessionId);

    await ctx.db.patch(user._id, { sessionId: undefined });
  },
});

export const updateSession = mutation({
  args: {
    sessionId: v.id("sessions"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userMetadata = await authComponent.safeGetAuthUser(ctx);
    if (!userMetadata) return null;
    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const session = await getDocumentOrThrow(ctx, "sessions", args.sessionId);

    if (session.hostId !== user._id) {
      throw new Error("Only session host can update the session");
    }

    await ctx.db.patch(args.sessionId, {
      title: args.title,
    });
  },
});
