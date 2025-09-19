import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";
import { betterAuthComponent } from "../auth";
import { findAndSetCurrentTask, getSession } from "../session/mutations";
import { getDocumentOrThrow } from "../utils/db";
import { taskType } from "./queries";
import { triggerTaskInternalMutation, triggerTaskMutation } from "./triggers";

export const _updateTask = triggerTaskInternalMutation({
  args: {
    id: v.id("tasks"),
    args: v.any(),
  },
  handler: async (ctx, { id, args }) => {
    await ctx.db.patch(id, args);
  },
});

export const addTask = triggerTaskMutation({
  args: {
    sessionId: v.id("sessions"),
    type: taskType,
    duration: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) throw new Error("User not authenticated");

    const user = await ctx.db.get(userMetadata.userId as Id<"users">);
    if (!user) throw new Error("User not found");

    const userId = user._id;
    await getSession(ctx, args.sessionId);

    const task = {
      userId,
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
      await findAndSetCurrentTask(ctx, args.sessionId);
    }

    return id;
  },
});

export const completeTaskIfElapsed = triggerTaskMutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await getDocumentOrThrow(ctx, "sessions", args.sessionId);
    if (!session.currentTaskId) return;

    const task = await getDocumentOrThrow(ctx, "tasks", session.currentTaskId);
    if (task.completed) return;

    const now = new Date().getTime();
    const start = session.startTime
      ? new Date(session.startTime).getTime()
      : null;
    const elapsed = (task.elapsed ?? 0) + (start ? now - start : 0);

    if (elapsed >= task.duration) {
      console.log(`✅ Task ${task._id} completed.`);

      await ctx.db.patch(task._id, {
        completed: true,
        completedAt: Date.now(),
        elapsed: task.duration,
      });

      await ctx.db.patch(session._id, {
        running: false,
        startTime: undefined,
        currentTaskId: undefined,
      });

      await findAndSetCurrentTask(ctx, session._id);
    }
  },
});

export const deleteTask = triggerTaskMutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await getDocumentOrThrow(ctx, "tasks", args.taskId);
    const session = await getSession(ctx, task.sessionId);
    const isCurrent = session.currentTaskId === task._id;

    await ctx.db.delete(args.taskId);
    console.log("🗑️ Deleted task:", task._id);

    if (isCurrent) {
      console.log("⚠️ Deleted task was current. Finding new task...");
      await findAndSetCurrentTask(ctx, session._id);
    } else {
      console.log("✅ Deleted task was not current. No reassignment needed.");
    }
  },
});

export const updateTask = triggerTaskMutation({
  args: {
    taskId: v.id("tasks"),
    type: v.optional(taskType),
    duration: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("📌 Running updateTask mutation");
    const task = await getDocumentOrThrow(ctx, "tasks", args.taskId);
    await getSession(ctx, task.sessionId);

    const { taskId, ...toUpdate } = args;
    await ctx.runMutation(internal.tasks.mutations._updateTask, {
      id: args.taskId,
      args: toUpdate,
    });
  },
});
