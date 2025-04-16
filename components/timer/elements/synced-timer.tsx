"use client";

import { Task } from "@/components/providers/LocalPomodoroProvider";
import { api } from "@/convex/_generated/api";
import {
  Preloaded,
  useMutation,
  usePreloadedQuery,
  useQuery,
} from "convex/react";
import { useEffect, useRef, useState } from "react";
import { Timer } from "./timer";
import { Doc } from "@/convex/_generated/dataModel";

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

  const startSession = useMutation(api.session.mutations.startSession);
  const pauseSession = useMutation(api.session.mutations.pauseSession);
  const resetSessionTimer = useMutation(
    api.session.mutations.resetSessionTimer,
  );
  const completeIfElapsed = useMutation(
    api.tasks.mutations.completeTaskIfElapsed,
  );

  const [localTimeLeft, setLocalTimeLeft] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const serverNow = useQuery(api.time.queries.getCurrentServerTime);

  const [timeOffset, setTimeOffset] = useState(0);

  useEffect(() => {
    if (serverNow) {
      const localNow = Date.now();
      setTimeOffset(serverNow - localNow);
    }
  }, [serverNow]);

  const calculateTimeLeft = () => {
    if (!currentTask) return 0;

    const now = Date.now() + timeOffset; // Adjust for clock drift
    const taskDuration = currentTask.duration ?? 0;
    const previouslyElapsed = currentTask.elapsed ?? 0;

    if (!session.running || !session.startTime) {
      return Math.max(0, taskDuration - previouslyElapsed);
    }

    const sessionStart = new Date(session.startTime).getTime();
    const elapsedSinceStart = now - sessionStart;
    const totalElapsed = previouslyElapsed + elapsedSinceStart;

    return Math.max(0, taskDuration - totalElapsed);
  };

  // Sync timer on initial render and when session/task changes
  useEffect(() => {
    const initialTimeLeft = calculateTimeLeft();
    setLocalTimeLeft(initialTimeLeft);
  }, [session, currentTask]);

  // Setup ticking interval
  useEffect(() => {
    if (!session.running || !currentTask) return;

    const tick = () => {
      const timeLeft = calculateTimeLeft();
      setLocalTimeLeft(timeLeft);

      if (timeLeft <= 0) {
        completeIfElapsed({ sessionId: session._id }).catch(console.error);
      }
    };

    intervalRef.current = setInterval(tick, 250);
    return () => clearInterval(intervalRef.current!);
  }, [session.running, session.startTime, currentTask?.elapsed]);

  // Task formatting for <Timer /> props
  const formatTask = (task: Doc<"tasks">): Task => ({
    id: task._id,
    completed: task.completed,
    description: task.description,
    duration: task.duration / 1000,
    type: task.type,
  });

  const currentTaskProp = currentTask ? formatTask(currentTask) : undefined;

  const tasksProp: Task[] = tasks.map(formatTask);

  const currentTaskIndex = tasks.findIndex((t) => !t.completed);
  const nextTask =
    currentTaskIndex >= 0 ? tasks[currentTaskIndex + 1] : undefined;
  const nextTaskProp = nextTask ? formatTask(nextTask) : undefined;

  return (
    <Timer
      title={session.title}
      isRunning={session.running}
      timer={currentTask ? localTimeLeft / 1000 : 0}
      currentTask={currentTaskProp}
      nextTask={nextTaskProp}
      tasks={tasksProp}
      actions={{
        startTimer: () => startSession({ sessionId: session._id }),
        pauseTimer: () => pauseSession({ sessionId: session._id }),
        resetTimer: () => resetSessionTimer({ sessionId: session._id }),
      }}
    />
  );
}
