"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Loader2, Pencil, TrashIcon } from "lucide-react";
import { Fragment, useState } from "react";
import UpdateTaskForm from "../forms/update-task-form";
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
import { FilePenLineIcon } from "../ui/animated-icons/file-pen-line";
import { DeleteIcon } from "../ui/animated-icons/delete-icon";

interface TaskItemProps {
  removeTask: any;
  updateTask: any;
  task: Doc<"tasks">;
  pending?: boolean;
  currentTaskId?: string;
}

export function TaskItem(props: TaskItemProps) {
  const { removeTask, task, pending, currentTaskId } = props;
  const [isEditing, setIsEditing] = useState(false);

  const handleEditingChange = (isEditing: boolean) => {
    setIsEditing(isEditing);
  };

  return (
    <div
      className={cn(
        "flex h-full w-full items-center gap-3 border border-b-0 text-sm",
      )}
    >
      <Checkbox
        id={task._id}
        className={cn(
          "ml-3 rounded-none",
          currentTaskId === task._id && "bg-secondary",
        )}
        checked={task.completed}
      />
      <div className="flex w-full items-center justify-between">
        <label
          htmlFor={task._id}
          className={cn("w-full", currentTaskId === task._id && "font-medium")}
        >
          {task.description}
        </label>

        <Badge variant="outline" className="mr-3 hidden capitalize md:block">
          {task.type}
        </Badge>
        <div className="flex items-center">
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
                className="h-full border border-t-0 border-r border-b-0 border-l px-3"
              />
            </DialogTrigger>
          </Dialog>
          <AnimatedButton
            variant="outline"
            disabled={pending}
            type="button"
            icon={<DeleteIcon className="h-full" />}
            onClick={removeTask}
            className="h-full border border-t-0 border-r-0 border-b-0 border-l-0 px-3"
          />
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
      <Skeleton className="ml-3 h-5 w-5 rounded-none" />
      <Skeleton className="h-5 w-full" />
      <Button variant="ghost" size="icon" disabled>
        <Skeleton className="h-5 w-5" />
      </Button>
    </div>
  );
}
