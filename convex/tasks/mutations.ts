import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { taskType } from "./queries";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "../_generated/api";
import { isUserHost } from "../session/queries";

// Add Task
// If there is no current task, set this one as the current task
export const addTask = mutation({
  args: {
    sessionId: v.id("sessions"),
    type: taskType,
    duration: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (!isUserHost) return;

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

    // If there is no current task, set this one as the current task
    const session = await ctx.runQuery(api.session.queries.getSession, {
      sessionId: args.sessionId,
    });
    if (!session.currentTask) {
      await ctx.runMutation(api.session.mutations.setCurrentTask, {
        sessionId: args.sessionId,
        taskId: id,
      });
    }

    return id;
  },
});

export const completeTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");
    if (task.userId !== userId) throw new Error("Not authorized");

    await ctx.db.patch(args.taskId, { completed: true });

    const session = await ctx.db.get(task.sessionId);
    if (!session) throw new Error("Session not found");

    if (session.currentTaskId === task._id) {
      await ctx.runMutation(api.session.mutations.findAndSetCurrentTask, {
        sessionId: task.sessionId,
      });
    }
  },
});

// When deleting a task, and it's the current task, set the current task to the next available task
export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");
    if (!isUserHost) return;

    const session = await ctx.db.get(task.sessionId);
    if (!session) throw new Error("Session not found");

    const isCurrent = session.currentTaskId === task._id;

    // Step 1: Delete the task
    await ctx.db.delete(args.taskId);
    console.log("🗑️ Deleted task:", task._id);

    // Step 2: If it was the current task, reassign a new one
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
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");
    if (!isUserHost) return;

    await ctx.db.patch(args.taskId, {
      type: args.type,
      duration: args.duration,
      description: args.description,
    });
  },
});
