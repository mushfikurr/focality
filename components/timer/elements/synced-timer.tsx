"use client";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Timer } from "./timer";
import { api } from "@/convex/_generated/api";
import { Task } from "@/components/providers/LocalPomodoroProvider";
import { useEffect, useRef, useState } from "react";

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

  const currentTaskProp = currentTask
    ? ({
        completed: currentTask.completed,
        description: currentTask.description,
        duration: currentTask.duration / 1000,
        id: currentTask._id,
        type: currentTask.type,
      } satisfies Task)
    : undefined;
  const tasksProp = tasks.map(
    (task) =>
      ({
        completed: task.completed,
        description: task.description,
        duration: task.duration / 1000,
        id: task._id,
        type: task.type,
      }) satisfies Task,
  );

  const currentTaskIndex = tasks.findIndex((task) => !task.completed);
  const nextTask =
    currentTaskIndex >= 0 && currentTaskIndex < tasks.length - 1
      ? tasks[currentTaskIndex + 1]
      : undefined;
  const nextTaskProp = nextTask
    ? ({
        completed: nextTask.completed,
        description: nextTask.description,
        duration: nextTask.duration / 1000,
        id: nextTask._id,
        type: nextTask.type,
      } satisfies Task)
    : undefined;

  const startSessionMutation = useMutation(api.session.mutations.startSession);
  const pauseSessionMutation = useMutation(api.session.mutations.pauseSession);
  const resetSessionTimerMutation = useMutation(
    api.session.mutations.resetSessionTimer,
  );

  const [localTimerInMs, setLocalTimerInMs] = useState(
    currentTask?.duration ?? 0,
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Ticking every second
  const tick = () => {
    setLocalTimerInMs((prevTime) => prevTime - 1000);
  };

  const startSession = async () => {
    // if (timerRef.current) {
    //   clearInterval(timerRef.current); // Clear any previous intervals
    // }
    // timerRef.current = setInterval(tick, 1000); // Start a new interval to tick every second

    await startSessionMutation({ sessionId: session._id });
  };

  // Pause session and stop the timer
  const pauseSession = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // Stop the timer
    }
    await pauseSessionMutation({ sessionId: session._id });
  };

  const resetSessionTimer = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    await resetSessionTimerMutation({ sessionId: session._id });
  };

  useEffect(() => {
    if (currentTask) {
      setLocalTimerInMs(currentTask?.duration);
    } else {
      setLocalTimerInMs(0);
    }
  }, [currentTask?.duration]);

  const clientTimer = localTimerInMs - (currentTask?.elapsed ?? 0);

  return (
    <Timer
      actions={{
        pauseTimer: pauseSession,
        startTimer: startSession,
        resetTimer: resetSessionTimer,
      }}
      timer={clientTimer / 1000}
      isRunning={session.running}
      currentTask={currentTaskProp}
      nextTask={nextTaskProp}
      tasks={tasksProp}
    />
  );
}
