"use client";

import {
  Preloaded,
  useMutation,
  usePreloadedQuery,
  useQuery,
} from "convex/react";
import Tasks from "./tasks";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Task } from "../providers/LocalPomodoroProvider";

interface SyncedTasksProps {
  sessionId: Id<"sessions">;
  preloadedSession: Preloaded<typeof api.session.queries.getSession>;
  preloadedTasks: Preloaded<typeof api.tasks.queries.listTasks>;
}

export function SyncedTasks({
  preloadedSession,
  sessionId,
  preloadedTasks,
}: SyncedTasksProps) {
  const addTaskMtn = useMutation(
    api.tasks.mutations.addTask,
  ).withOptimisticUpdate((localStore, args) => {
    const { sessionId, description, duration, type } = args;
    const currentValue = localStore.getQuery(api.tasks.queries.listTasks, {
      sessionId: sessionId as Id<"sessions">,
    });
    if (currentValue !== undefined) {
      const newTaskItem: Doc<"tasks"> = {
        _id: crypto.randomUUID() as Id<"tasks">,
        elapsed: 0,
        _creationTime: new Date().getTime(),
        userId: "1" as Id<"users">,
        completed: false,
        description: description,
        duration: duration,
        type: type,
        sessionId: sessionId as Id<"sessions">,
      };

      localStore.setQuery(
        api.tasks.queries.listTasks,
        { sessionId: sessionId },
        [...currentValue, newTaskItem],
      );
    }
  });

  const session = useQuery(api.session.queries.getSession, {
    sessionId: sessionId,
  });

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
  const handleCompleteTask = async (taskId: string) => {
    await completeTaskMtn({ sessionId: sessionId as Id<"sessions"> });
  };

  const updateTaskMtn = useMutation(api.tasks.mutations.updateTask);
  const handleUpdateTask = async (taskId: string, task: Partial<Task>) => {
    await updateTaskMtn({
      taskId: taskId as Id<"tasks">,
      description: task.description,
      duration: task.duration,
      type: task.type,
    });
  };

  const tasksQuery = usePreloadedQuery(preloadedTasks);

  const tasks =
    tasksQuery?.map((t) => ({
      id: t._id,
      completed: t.completed,
      description: t.description,
      duration: t.duration,
      type: t.type,
    })) ?? [];

  return (
    <Tasks
      actions={{
        addBreak: handleAddBreak,
        addTask: handleAddTask,
        removeTask: handleRemoveTask,
        completeTask: handleCompleteTask,
        updateTask: handleUpdateTask,
      }}
      currentTaskId={session?.session.currentTaskId}
      tasks={tasks}
    />
  );
}
