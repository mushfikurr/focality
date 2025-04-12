import { LocalPomodoroContext } from "@/components/providers/LocalPomodoroProvider";
import { useContext } from "react";

export const useLocalPomodoroSession = () => {
  const context = useContext(LocalPomodoroContext);
  if (!context)
    throw new Error("usePomodoroSession must be used within PomodoroProvider");
  return {
    session: context.session,
    currentTask: context.currentTask,
    nextTask: context.nextTask,
  };
};
