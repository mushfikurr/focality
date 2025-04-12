import { LocalPomodoroContext } from "@/components/providers/LocalPomodoroProvider";
import { useContext } from "react";

export const useLocalPomodoroTimer = () => {
  const context = useContext(LocalPomodoroContext);
  if (!context)
    throw new Error("usePomodoroTimer must be used within PomodoroProvider");
  return {
    timer: context.timer,
    startTimer: context.startTimer,
    pauseTimer: context.pauseTimer,
    resetTimer: context.resetTimer,
  };
};
