"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { cn, formatTimeFromSecondsToMMSS } from "@/lib/utils";
import { Fragment, useState } from "react";
import UpdateTaskForm from "../forms/update-task-form";
import { DeleteIcon } from "../ui/animated-icons/delete-icon";
import { FilePenLineIcon } from "../ui/animated-icons/file-pen-line";
import { Badge } from "../ui/badge";
import { AnimatedButton, Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { CheckCheck } from "lucide-react";

interface TaskItemProps {
  removeTask: (taskId: string) => void;
  updateTask: (taskId: string, task: Partial<Doc<"tasks">>) => void;
  task: Doc<"tasks">;
  pending?: boolean;
  currentTaskId?: string;
}

export function TaskItem(props: TaskItemProps) {
  const { removeTask, task, pending, currentTaskId } = props;
  const [isEditing, setIsEditing] = useState(false);
  const completedAtDate = task.completedAt ? new Date(task.completedAt) : null;
  const completedAt = completedAtDate
    ? formatDistanceToNow(completedAtDate, { addSuffix: true })
    : null;

  const handleEditingChange = (isEditing: boolean) => {
    setIsEditing(isEditing);
  };

  return (
    <div
      className={cn(
        "text-muted-foreground flex h-full w-full cursor-default items-center justify-between gap-1 text-sm",
        currentTaskId === task._id && "text-foreground",
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          id={task._id}
          className={cn(currentTaskId === task._id && "bg-secondary")}
          checked={task.completed}
        />
        <label
          htmlFor={task._id}
          className={cn("w-full", currentTaskId === task._id && "font-medium")}
        >
          {`${task.description} - ${formatTimeFromSecondsToMMSS(task.duration / 1000)}`}
        </label>
      </div>

      <div className="flex items-center">
        <div className="flex w-full items-center gap-1.5">
          {completedAt && (
            <span className="flex items-center gap-1.5">
              <CheckCheck />
              <p className="mr-3 w-full text-xs">{completedAt}</p>
            </span>
          )}
          <Badge variant="outline" className="mr-3 hidden capitalize md:block">
            {task.type}
          </Badge>

          <div className="flex items-center gap-1">
            <Dialog open={isEditing} onOpenChange={(o) => setIsEditing(o)}>
              <DialogContent>
                <UpdateTaskItemDialog
                  task={task}
                  handleEditingChange={handleEditingChange}
                />
              </DialogContent>
              <DialogTrigger asChild>
                <AnimatedButton
                  variant="outline"
                  disabled={pending}
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  icon={<FilePenLineIcon className="h-full" />}
                  className="h-full px-3"
                />
              </DialogTrigger>
            </Dialog>
            <AnimatedButton
              variant="outline"
              disabled={pending}
              type="button"
              icon={<DeleteIcon className="h-full" />}
              onClick={removeTask}
              className="h-full px-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface TaskItemDialogProps {
  task: Doc<"tasks">;
  handleEditingChange: (isEditing: boolean) => void;
}

export function UpdateTaskItemDialog(props: TaskItemDialogProps) {
  const { task, handleEditingChange } = props;

  return (
    <Fragment>
      <DialogHeader>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogDescription>Edit your task details.</DialogDescription>
      </DialogHeader>

      <UpdateTaskForm handleEditingChange={handleEditingChange} task={task}>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button variant="default" type="submit">
            Edit Task
          </Button>
        </DialogFooter>
      </UpdateTaskForm>
    </Fragment>
  );
}

export function TaskItemSkeleton() {
  return (
    <div className="flex w-full items-center gap-3 border border-b-0 text-sm last:border-b">
      <Skeleton className="ml-3 h-5 w-5" />
      <Skeleton className="h-5 w-full" />
      <Button variant="ghost" size="icon" disabled>
        <Skeleton className="h-5 w-5" />
      </Button>
    </div>
  );
}
