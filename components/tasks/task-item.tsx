"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Task } from "../providers/LocalPomodoroProvider";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Editable } from "../ui/editable";
import { Skeleton } from "../ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

interface TaskItemProps {
  removeTask: any;
  updateTask: any;
  task: Task;
  pending?: boolean;
  currentTaskId?: string;
}

const formSchema = z.object({
  description: z.string().min(3),
});

export function TaskItem(props: TaskItemProps) {
  const { removeTask, task, pending, currentTaskId } = props;
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: task.description,
    },
    values: {
      description: task.description,
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    props.updateTask(task.id, data);
  };

  const handleEditingChange = (isEditing: boolean) => {
    setIsEditing(isEditing);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div
          className={cn(
            "flex h-full w-full items-center gap-3 border border-b-0 text-sm",
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <>
                <label
                  htmlFor={task.id}
                  className={cn(
                    "inline-flex w-full items-center gap-3 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  )}
                >
                  <Editable
                    {...field}
                    isEditing={isEditing}
                    onConfirm={(value) => {
                      setIsEditing(false);
                      field.onChange(value);
                      form.handleSubmit(handleSubmit)();
                    }}
                    onCancel={() => {
                      setIsEditing(false);
                      field.onBlur();
                    }}
                    onEditingChange={handleEditingChange}
                    className={cn(
                      currentTaskId === task.id && "font-medium",
                      "max-w-[100px] truncate md:max-w-full",
                    )}
                  />
                </label>
                <Badge variant="outline" className="hidden capitalize md:block">
                  {task.type}
                </Badge>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    disabled={pending}
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="h-full border border-t-0 border-r border-b-0 border-l"
                  >
                    {pending ? (
                      <Loader2 className="text-muted absolute animate-spin" />
                    ) : (
                      <Pencil className="h-full" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={pending}
                    onClick={removeTask}
                    className="h-full border-none"
                  >
                    {pending ? (
                      <Loader2 className="text-muted absolute animate-spin" />
                    ) : (
                      <TrashIcon className="h-full" />
                    )}
                  </Button>
                </div>
              </>
            )}
          />
        </div>
      </form>
    </Form>
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
