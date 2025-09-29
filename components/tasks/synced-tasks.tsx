"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import Tasks from "./tasks";

interface SyncedTasksProps {
  preloadedSession: Preloaded<typeof api.session.queries.getSession>;
  preloadedTasks: Preloaded<typeof api.tasks.queries.listTasks>;
}

export function SyncedTasks({
  preloadedSession,
  preloadedTasks,
}: SyncedTasksProps) {
  const addTaskMtn = useMutation(api.tasks.mutations.addTask);

  const session = usePreloadedQuery(preloadedSession);
  const sessionId = session.session._id;

  const handleAddBreak = async () => {
    await addTaskMtn({
      type: "break",
      duration: 5 * 60 * 1000,
      description: "Break",
      sessionId: sessionId as Id<"sessions">,
    });
  };

  const handleAddTask = async () => {
    await addTaskMtn({
      type: "task",
      duration: 1 * 60 * 1000,
      description: "Task",
      sessionId: sessionId as Id<"sessions">,
    });
  };

  const removeTaskMtn = useMutation(
    api.tasks.mutations.deleteTask,
  ).withOptimisticUpdate((localStore, args) => {
    const { taskId } = args;
    const currentValue = localStore.getQuery(api.tasks.queries.listTasks, {
      sessionId: sessionId as Id<"sessions">,
    });
    if (currentValue !== undefined) {
      localStore.setQuery(
        api.tasks.queries.listTasks,
        { sessionId: sessionId as Id<"sessions"> },
        currentValue.filter((t) => t._id !== taskId),
      );
    }
  });
  const handleRemoveTask = async (taskId: string) => {
    await removeTaskMtn({ taskId: taskId as Id<"tasks"> });
  };

  const completeTaskMtn = useMutation(
    api.tasks.mutations.completeTaskIfElapsed,
  );
  const handleCompleteTask = async () => {
    await completeTaskMtn({ sessionId: sessionId as Id<"sessions"> });
  };

  const updateTaskMtn = useMutation(api.tasks.mutations.updateTask);
  const handleUpdateTask = async (
    taskId: string,
    task: Partial<Doc<"tasks">>,
  ) => {
    await updateTaskMtn({
      taskId: taskId as Id<"tasks">,
      description: task.description,
      duration: task.duration,
      type: task.type,
    });
  };

  const tasksQuery = usePreloadedQuery(preloadedTasks);
  const tasksTitle = session?.session.title ?? "Session Tasks";

  return (
    <Tasks
      title={tasksTitle}
      actions={{
        addBreak: handleAddBreak,
        addTask: handleAddTask,
        removeTask: handleRemoveTask,
        completeTask: handleCompleteTask,
        updateTask: handleUpdateTask,
      }}
      currentTaskId={session?.session.currentTaskId}
      tasks={tasksQuery}
      sessionId={sessionId}
    />
  );
}
