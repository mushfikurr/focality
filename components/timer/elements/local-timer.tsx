"use client";

import { useLocalPomodoroSession } from "@/lib/hooks/use-local-pomodoro-session";
import { useLocalPomodoroTimer } from "@/lib/hooks/use-local-pomodoro-timer";
import { Timer } from "./timer";

export function LocalTimer() {
  const { timer, startTimer, pauseTimer, resetTimer } = useLocalPomodoroTimer();
  const { session, currentTask, nextTask } = useLocalPomodoroSession();

  const formatType = (type: "task" | "break") =>
    type === "task" ? "Task" : "Break";

  return (
    <Timer
      actions={{ pauseTimer, startTimer, resetTimer }}
      timer={timer}
      isRunning={session.running}
      currentTask={currentTask}
      nextTask={nextTask}
      tasks={session.tasks}
    />
  );
}
