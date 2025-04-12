import { useLocalPomodoroTasks } from "@/lib/hooks/use-local-pomodoro-tasks";
import { TrashIcon } from "lucide-react";
import { Task } from "../providers/LocalPomodoroProvider";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "../ui/skeleton";

interface TaskItemProps {
  removeTask: any;
  task: Task;
}

export function TaskItem(props: TaskItemProps) {
  const { removeTask, task } = props;
  return (
    <div className="flex w-full items-center gap-3 border border-b-0 text-sm last:border-b">
      <Checkbox
        id={task.id}
        className="ml-3 rounded-none"
        checked={task.completed}
      />
      <label
        htmlFor={task.id}
        className="w-full py-3 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {task.description}
      </label>
      <Button variant="ghost" size="icon" onClick={removeTask}>
        <TrashIcon />
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
