import { Progress } from "@/components/ui/progress";
import { Doc } from "@/convex/_generated/dataModel";
import { formatTime } from "@/lib/utils";
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
  title?: string;
  actions: {
    startTimer: any;
    pauseTimer: any;
    resetTimer: any;
  };
  currentTask?: Doc<"tasks">;
  nextTask?: Doc<"tasks">;
  tasks: Doc<"tasks">[];
}
export function Timer(props: TimerProps) {
  const { timer, isRunning, actions, currentTask, tasks, title, nextTask } =
    props;

  const progressPercentage = currentTask
    ? ((currentTask.duration - timer) / currentTask.duration) * 100
    : 0;
  const formatType = (type: "task" | "break") =>
    type === "task" ? "Task" : "Break";

  return (
    <Card className="flex h-full flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <h1>{title ? title : "Current Session"}</h1>
          <span className="text-primary flex items-center gap-2.5 text-sm font-medium">
            <span className={`bg-primary h-2 w-2`}></span>
            <p className="mb-[2px]">{isRunning ? "Working" : "Paused"}</p>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <div className="text-center">
            <h2 className="mb-2 font-mono text-6xl font-semibold tracking-tight">
              {formatTime(timer)}
            </h2>
            <p className="text-muted-foreground text-sm">
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
        <div className="flex w-full flex-col gap-3 text-sm">
          <div className="flex items-center justify-between gap-2 font-medium">
            <p>Task progress</p>
            <p>{Math.floor(progressPercentage)}%</p>
          </div>
          <Progress className="h-3 rounded-none" value={progressPercentage} />
          <div className="text-muted-foreground flex justify-between gap-2">
            {currentTask ? (
              <p>
                {formatType(currentTask.type)}:{" "}
                {formatTime(currentTask.duration / 1000)}
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
                {formatTime(nextTask.duration / 1000)}
              </p>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
