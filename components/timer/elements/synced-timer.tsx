"use client";

import { Task } from "@/components/providers/LocalPomodoroProvider";
import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { Timer } from "./timer";

interface SyncedTimerProps {
  preloadedSession: Preloaded<typeof api.session.queries.getSession>;
  preloadedTasks: Preloaded<typeof api.tasks.queries.listTasks>;
}

export function SyncedTimer({
  preloadedSession,
  preloadedTasks,
}: SyncedTimerProps) {
  const { session, currentTask } = usePreloadedQuery(preloadedSession);
  const tasks = usePreloadedQuery(preloadedTasks);

  const startSessionMutation = useMutation(api.session.mutations.startSession);
  const pauseSessionMutation = useMutation(api.session.mutations.pauseSession);
  const resetSessionTimerMutation = useMutation(
    api.session.mutations.resetSessionTimer,
  );
  const completeIfElapsed = useMutation(
    api.tasks.mutations.completeTaskIfElapsed,
  );

  const getClientTimeLeft = () => {
    if (!currentTask) return 0;

    const now = Date.now();
    const start = session.startTime
      ? new Date(session.startTime).getTime()
      : null;
    const elapsedSinceStart = session.running && start ? now - start : 0;
    const totalElapsed = (currentTask.elapsed ?? 0) + elapsedSinceStart;

    const timeLeft = (currentTask.duration ?? 0) - totalElapsed;
    return Math.max(0, timeLeft);
  };

  const [localTimeLeft, setLocalTimeLeft] = useState(getClientTimeLeft());
  const localStartRef = useRef<number | null>(null);

  useEffect(() => {
    const clientLeft = getClientTimeLeft();
    setLocalTimeLeft(clientLeft);

    if (session.running && session.startTime) {
      localStartRef.current = new Date(session.startTime).getTime();
    } else {
      localStartRef.current = null;
    }
  }, [session, currentTask]);

  useEffect(() => {
    if (!session.running || !currentTask) return;

    const interval = setInterval(() => {
      if (!localStartRef.current) return;

      const now = Date.now();
      const elapsedSinceStart = now - localStartRef.current;
      const totalElapsed = (currentTask.elapsed ?? 0) + elapsedSinceStart;
      const timeLeft = (currentTask.duration ?? 0) - totalElapsed;

      const clampedTime = Math.max(0, timeLeft);
      setLocalTimeLeft(clampedTime);

      if (clampedTime <= 0) {
        completeIfElapsed({ sessionId: session._id }).catch(console.error);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [session.running, currentTask]);

  // Format tasks
  const currentTaskProp: Task | undefined = currentTask
    ? {
        id: currentTask._id,
        completed: currentTask.completed,
        description: currentTask.description,
        duration: currentTask.duration / 1000,
        type: currentTask.type,
      }
    : undefined;

  const tasksProp: Task[] = tasks.map((task) => ({
    id: task._id,
    completed: task.completed,
    description: task.description,
    duration: task.duration / 1000,
    type: task.type,
  }));

  const currentTaskIndex = tasks.findIndex((task) => !task.completed);
  const nextTask =
    currentTaskIndex >= 0 ? tasks[currentTaskIndex + 1] : undefined;

  const nextTaskProp: Task | undefined = nextTask
    ? {
        id: nextTask._id,
        completed: nextTask.completed,
        description: nextTask.description,
        duration: nextTask.duration / 1000,
        type: nextTask.type,
      }
    : undefined;

  const startSession = async () => {
    await startSessionMutation({ sessionId: session._id });
  };

  const pauseSession = async () => {
    await pauseSessionMutation({ sessionId: session._id });
  };

  const resetSessionTimer = async () => {
    await resetSessionTimerMutation({ sessionId: session._id });
  };

  return (
    <Timer
      actions={{
        pauseTimer: pauseSession,
        startTimer: startSession,
        resetTimer: resetSessionTimer,
      }}
      title={session.title}
      timer={currentTask ? localTimeLeft / 1000 : 0}
      isRunning={session.running}
      currentTask={currentTaskProp}
      nextTask={nextTaskProp}
      tasks={tasksProp}
    />
  );
}
