import { WithoutSystemFields } from "convex/server";
import { v } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { mutation, MutationCtx } from "../_generated/server";
import { durationByUserAggregate } from "../statistics/tasks/queries";
import { validateSessionHost } from "../utils/auth";
import { getDocumentOrThrow } from "../utils/db";
import { taskType } from "./queries";
import { findAndSetCurrentTask } from "../session/mutations";
import { triggerTaskMutation } from "./triggers";


const _insertTask = async (
  ctx: MutationCtx,
  args: WithoutSystemFields<Doc<"tasks">>,
) => {
  const id = await ctx.db.insert("tasks", args);
  const doc = await getDocumentOrThrow(ctx, "tasks", id);
  await durationByUserAggregate.insert(ctx, doc);
};

export const _updateTask = async (
  ctx: MutationCtx,
  id: Id<"tasks">,
  args: Partial<WithoutSystemFields<Doc<"tasks">>>,
) => {
  const oldDoc = await getDocumentOrThrow(ctx, "tasks", id);
  console.log(oldDoc);
  await ctx.db.patch(id, args);
  const newDoc = await getDocumentOrThrow(ctx, "tasks", id);
  await durationByUserAggregate.replace(ctx, oldDoc, newDoc);
};

const _removeTask = async (ctx: MutationCtx, id: Id<"tasks">) => {
  const doc = await getDocumentOrThrow(ctx, "tasks", id);
  await ctx.db.delete(id);
  await durationByUserAggregate.deleteIfExists(ctx, doc);
};

export const addTask = mutation({
  args: {
    sessionId: v.id("sessions"),
    type: taskType,
    duration: v.number(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await validateSessionHost(ctx, args.sessionId);

    const task = {
      userId,
      sessionId: args.sessionId,
      type: args.type,
      duration: args.duration,
      description: args.description,
      elapsed: 0,
      completed: false,
    };

    const id = _insertTask(ctx, task);

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

      // Update completed status to true for task
      await _updateTask(ctx, task._id, {
        completed: true,
        elapsed: task.duration,
      });

      // Set session to not running, reset current task, and reset start time
      await ctx.db.patch(session._id, {
        running: false,
        startTime: undefined,
        currentTaskId: undefined,
      });

      // Find and set the next incomplete task
      await findAndSetCurrentTask(ctx, session._id);
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

    await _removeTask(ctx, args.taskId);
    console.log("🗑️ Deleted task:", task._id);

    if (isCurrent) {
      console.log("⚠️ Deleted task was current. Finding new task...");
      await findAndSetCurrentTask(ctx, session._id);
    } else {
      console.log("✅ Deleted task was not current. No reassignment needed.");
    }
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    type: v.optional(taskType),
    duration: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("📌 Running updateTask mutation");
    const task = await getDocumentOrThrow(ctx, "tasks", args.taskId);
    await validateSessionHost(ctx, task.sessionId);

    const { taskId, ...toUpdate } = args;
    await _updateTask(ctx, args.taskId, toUpdate);
  },
});
