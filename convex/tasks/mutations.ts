import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { taskType } from "./queries";
import { api } from "../_generated/api";
import { validateSessionHost } from "../utils/auth";
import { getDocumentOrThrow } from "../utils/db";

export const addTask = mutation({
  args: {
    sessionId: v.id("sessions"),
    type: taskType,
    duration: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await validateSessionHost(ctx, args.sessionId);

    const task = {
      userId: await validateSessionHost(ctx, args.sessionId),
      sessionId: args.sessionId,
      type: args.type,
      duration: args.duration,
      description: args.description,
      elapsed: 0,
      completed: false,
    };

    const id = await ctx.db.insert("tasks", task);

    const session = await getDocumentOrThrow(ctx, "sessions", args.sessionId);
    if (!session.currentTaskId) {
      console.log("🆕 No current task. Will try to set the new one.");
      await ctx.runMutation(api.session.mutations.findAndSetCurrentTask, {
        sessionId: args.sessionId,
      });
    }

    return id;
  },
});

export const completeTaskIfElapsed = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await getDocumentOrThrow(ctx, "sessions", args.sessionId);
    if (!session.currentTaskId) return;

    const task = await getDocumentOrThrow(ctx, "tasks", session.currentTaskId);
    if (task.completed) return;

    const now = new Date().getTime();
    const start = session.startTime ? new Date(session.startTime).getTime() : null;
    const elapsed = (task.elapsed ?? 0) + (start ? now - start : 0);

    if (elapsed >= task.duration) {
      console.log(`✅ Task ${task._id} completed.`);

      await ctx.db.patch(task._id, {
        completed: true,
        elapsed: task.duration,
      });

      await ctx.db.patch(session._id, {
        running: false,
        startTime: undefined,
        currentTaskId: undefined,
      });

      await ctx.runMutation(api.session.mutations.findAndSetCurrentTask, {
        sessionId: session._id,
      });
    }
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await getDocumentOrThrow(ctx, "tasks", args.taskId);
    await validateSessionHost(ctx, task.sessionId);

    const session = await getDocumentOrThrow(ctx, "sessions", task.sessionId);
    const isCurrent = session.currentTaskId === task._id;

    await ctx.db.delete(args.taskId);
    console.log("🗑️ Deleted task:", task._id);

    if (isCurrent) {
      console.log("⚠️ Deleted task was current. Finding new task...");
      await ctx.runMutation(api.session.mutations.findAndSetCurrentTask, {
        sessionId: session._id,
      });
    } else {
      console.log("✅ Deleted task was not current. No reassignment needed.");
    }
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    type: taskType,
    duration: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await getDocumentOrThrow(ctx, "tasks", args.taskId);
    await validateSessionHost(ctx, task.sessionId);

    await ctx.db.patch(args.taskId, {
      type: args.type,
      duration: args.duration,
      description: args.description,
    });
  },
});
