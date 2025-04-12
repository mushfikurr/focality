import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { api } from "../_generated/api";
import { Doc } from "../_generated/dataModel";

export const setCurrentTask = mutation({
  args: {
    sessionId: v.id("sessions"),
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.hostId !== userId)
      throw new Error("Only the host can set the current task");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");
    if (task.sessionId !== args.sessionId)
      throw new Error("Task not associated with session");

    await ctx.db.patch(args.sessionId, {
      currentTaskId: args.taskId,
    });
  },
});

export const clearCurrentTask = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.hostId !== userId)
      throw new Error("Only the host can delete the current task");

    return await ctx.db.patch(args.sessionId, {
      currentTaskId: undefined,
    });
  },
});

export const findAndSetCurrentTask = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    console.log(
      "📌 Running findAndSetCurrentTask for session:",
      args.sessionId,
    );

    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.hostId !== userId) throw new Error("Not authorized");

    let currentTask: Doc<"tasks"> | null = null;

    if (session.currentTaskId) {
      currentTask = await ctx.db.get(session.currentTaskId);
      if (currentTask) {
        console.log("✅ currentTaskId is valid:", currentTask._id);
        return currentTask;
      } else {
        console.log("⚠️ currentTaskId is stale. Will find a new task.");
      }
    }

    const nextTask = await ctx.db
      .query("tasks")
      .withIndex("by_session", (q) => q.eq("sessionId", session._id))
      .order("asc")
      .first();

    if (!nextTask) {
      console.log("❌ No tasks available to set as current.");
      await ctx.runMutation(api.session.mutations.clearCurrentTask, {
        sessionId: session._id,
      });
      return null;
    }

    console.log("✅ Found next task to set as current:", nextTask._id);

    await ctx.runMutation(api.session.mutations.setCurrentTask, {
      sessionId: session._id,
      taskId: nextTask._id,
    });

    return nextTask;
  },
});

export const createSession = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    tasks: v.optional(v.array(v.id("tasks"))),
    visibility: v.union(v.literal("public"), v.literal("private")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = {
      hostId: userId,
      userIds: [userId],
      running: false,
      title: args.title,
      description: args.description,
      startTime: undefined,
      currentTaskId: undefined,
      roomId: undefined,
    };

    const sessionId = await ctx.db.insert("sessions", session);
    return sessionId;
  },
});

export const startSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.user.currentUser);
    const session = await ctx.db.get(args.sessionId);
    if (!user) throw new Error("Not authenticated");
    if (!session) throw new Error("Session not found");
    if (user._id !== session.hostId) throw new Error("Not authorized");

    if (!session.startTime) {
      await ctx.db.patch(args.sessionId, {
        startTime: new Date().toISOString(),
      });
    }

    await ctx.db.patch(args.sessionId, {
      running: true,
    });
  },
});

export const pauseSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.user.currentUser);
    const session = await ctx.db.get(args.sessionId);
    if (!user) throw new Error("Not authenticated");
    if (!session) throw new Error("Session not found");

    if (session.currentTaskId && session.startTime) {
      const startTime = new Date(session.startTime);
      const now = new Date();
      console.log(startTime, now);
      const elapsedTime = now.getTime() - startTime.getTime();
      console.log(elapsedTime);
      await ctx.db.patch(session.currentTaskId, {
        elapsed: elapsedTime,
      });
    }

    await ctx.db.patch(args.sessionId, {
      running: false,
      startTime: new Date().toISOString(),
    });
  },
});

export const resetSessionTimer = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    // const user = await ctx.runQuery(api.user.currentUser);
    // const session = await ctx.db.get(args.sessionId);
    // if (!user) throw new Error("Not authenticated");
    // if (!session) throw new Error("Session not found");
    // if (user._id !== session.hostId) throw new Error("Not authorized");
    // if (session.currentTaskId) {
    //   const currentTask = await ctx.db.get(session.currentTaskId);
    //   if (currentTask) {
    //     timer = currentTask.duration;
    //   }
    // }
    // await ctx.db.patch(args.sessionId, {
    //   running: false,
    // });
  },
});

export const deleteSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.hostId !== userId)
      throw new Error("Only the host can delete the session");

    await ctx.db.delete(args.sessionId);
  },
});
