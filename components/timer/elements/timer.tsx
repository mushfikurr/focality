import { formatTime } from "@/lib/utils";
import { Task } from "../../providers/LocalPomodoroProvider";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";

interface TimerProps {
  timer: number;
  isRunning: boolean;
  actions: {
    startTimer: any;
    pauseTimer: any;
    resetTimer: any;
  };
  currentTask?: Task;
  nextTask?: Task;
  tasks: Task[];
}
export function Timer(props: TimerProps) {
  const { timer, isRunning, actions, currentTask, tasks, nextTask } = props;

  const progressPercentage = currentTask
    ? ((currentTask.duration - timer) / currentTask.duration) * 100
    : 0;
  const formatType = (type: "task" | "break") =>
    type === "task" ? "Task" : "Break";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <h1>Current Session</h1>
          <span className="text-primary flex items-center gap-2.5 text-xs font-medium">
            <p>●</p>
            <p className="mb-[2px]">{isRunning ? "Working" : "Paused"}</p>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col items-center justify-center gap-8 py-6">
          <div className="text-center">
            <h2 className="mb-2 font-mono text-6xl font-semibold tracking-tight">
              {formatTime(timer)}
            </h2>
            <p className="text-muted-foreground text-xs">
              {currentTask
                ? `${formatType(currentTask.type)}: ${currentTask.description}`
                : "No current task"}
            </p>
          </div>
          <div className="flex gap-3">
            {isRunning ? (
              <Button onClick={actions.pauseTimer}>Pause</Button>
            ) : (
              <Button
                onClick={actions.startTimer}
                disabled={!currentTask || timer === 0}
              >
                Start
              </Button>
            )}
            <Button
              variant="outline"
              onClick={actions.resetTimer}
              disabled={!currentTask || timer === 0}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col gap-3 text-xs">
          <div className="flex items-center justify-between gap-2 font-medium">
            <p>Task progress</p>
            <p>{Math.floor(progressPercentage)}%</p>
          </div>
          <div className="bg-muted relative h-3 border">
            <div
              className="bg-primary h-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-muted-foreground flex justify-between gap-2">
            {currentTask ? (
              <p>
                {formatType(currentTask.type)}:{" "}
                {formatTime(currentTask.duration)}
              </p>
            ) : (
              !currentTask &&
              tasks.length !== 0 && (
                <p className="text-primary">All tasks completed!</p>
              )
            )}
            {nextTask && (
              <p>
                Next: {formatType(nextTask.type)} -{" "}
                {formatTime(nextTask.duration)}
              </p>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
