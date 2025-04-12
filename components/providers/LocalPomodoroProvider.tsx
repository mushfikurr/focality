import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export type Task = {
  id: string;
  type: "task" | "break";
  duration: number;
  description: string;
  completed: boolean;
};

export type Session = {
  tasks?: Task[];
  running: boolean;
};

// Context
export const LocalPomodoroContext = createContext<any>(null);

export const LocalPomodoroProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session>({
    tasks: [],
    running: false,
  });

  const tasks = session.tasks ?? [];

  const [timer, setTimer] = useState<number>(tasks[0]?.duration ?? 0);

  const currentTaskIndex = tasks.findIndex((task) => !task.completed);
  const currentTask = currentTaskIndex >= 0 ? tasks[currentTaskIndex] : null;
  const nextTask =
    currentTaskIndex >= 0 && currentTaskIndex < tasks.length - 1
      ? tasks[currentTaskIndex + 1]
      : null;

  useEffect(() => {
    if (currentTask) {
      setTimer(currentTask.duration);
    } else {
      setTimer(0);
    }
  }, [currentTask, tasks]);

  const startTimer = () => {
    if (tasks.length > 0 && timer !== 0) {
      setSession((prev) => ({ ...prev, running: true }));
    }
  };

  const pauseTimer = () => {
    setSession((prev) => ({ ...prev, running: false }));
  };

  const resetTimer = () => {
    setTimer(currentTask?.duration ?? 0);
    pauseTimer();
  };

  const completeTask = (id: string) => {
    if (!tasks.length) return;

    setSession((prev) => ({
      ...prev,
      tasks: tasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task,
      ),
    }));
  };

  const onTaskComplete = () => {
    if (currentTask) {
      completeTask(currentTask.id);
    }
    pauseTimer();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (session.running && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            onTaskComplete();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session.running, timer, currentTask]);

  return (
    <LocalPomodoroContext.Provider
      value={{
        session,
        setSession,
        timer,
        startTimer,
        pauseTimer,
        resetTimer,
        currentTask,
        nextTask,
        completeTask,
      }}
    >
      {children}
    </LocalPomodoroContext.Provider>
  );
};
