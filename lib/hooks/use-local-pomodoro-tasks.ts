import {
  LocalPomodoroContext,
  Session,
  Task,
} from "@/components/providers/LocalPomodoroProvider";
import { useContext } from "react";

export const useLocalPomodoroTasks = () => {
  const context = useContext(LocalPomodoroContext);
  if (!context)
    throw new Error("usePomodoroTasks must be used within PomodoroProvider");

  const { setSession, session, completeTask } = context;

  const addTask = (task: Task) => {
    setSession((prev: Session) => ({
      ...prev,
      tasks: [...(prev.tasks ?? []), task],
    }));
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setSession((prev: Session) => ({
      ...prev,
      tasks: prev.tasks?.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task,
      ),
    }));
  };

  const deleteTask = (id: string) => {
    setSession((prev: Session) => ({
      ...prev,
      tasks: prev.tasks?.filter((task) => task.id !== id),
    }));
  };

  return {
    tasks: session.tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
  };
};
