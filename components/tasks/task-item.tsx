import { cn } from "@/lib/utils";
import { Loader2, TimerIcon, TrashIcon } from "lucide-react";
import { Task } from "../providers/LocalPomodoroProvider";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

interface TaskItemProps {
  removeTask: any;
  task: Task;
  pending?: boolean;
  currentTaskId?: string;
}

export function TaskItem(props: TaskItemProps) {
  const { removeTask, task, pending, currentTaskId } = props;
  return (
    <div
      className={cn(
        "flex h-full w-full items-center gap-3 border border-b-0 text-sm last:border-b",
      )}
    >
      <Checkbox
        id={task.id}
        className={cn(
          "ml-3 rounded-none",
          currentTaskId === task.id && "bg-secondary",
        )}
        checked={task.completed}
      />
      <label
        htmlFor={task.id}
        className={cn(
          "inline-flex w-full items-center gap-3 py-3 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        )}
      >
        {task.description}
      </label>
      <Badge variant="outline" className="capitalize">
        {task.type}
      </Badge>
      <Button
        variant="outline"
        disabled={pending}
        size="icon"
        onClick={removeTask}
        className="h-full border-l border-none py-3"
      >
        {pending ? (
          <Loader2 className="text-muted absolute animate-spin" />
        ) : (
          <TrashIcon className="h-full" />
        )}
      </Button>
    </div>
  );
}

export function TaskItemSkeleton() {
  return (
    <div className="flex w-full items-center gap-3 border border-b-0 text-sm last:border-b">
      <Skeleton className="ml-3 h-5 w-5 rounded-none" />
      <Skeleton className="h-5 w-full" />
      <Button variant="ghost" size="icon" disabled>
        <Skeleton className="h-5 w-5" />
      </Button>
    </div>
  );
}
