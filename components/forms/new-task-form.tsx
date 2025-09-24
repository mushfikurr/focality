"use client";

import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { TimePickerInput } from "../ui/time-picker-input";
import { useConvexMutation } from "@convex-dev/react-query";

interface NewTaskFormProps {
  sessionId: Id<"sessions">;
  break?: boolean;
  children?: React.ReactNode;
  onCancel?: any;
}

const formSchema = z.object({
  description: z
    .string()
    .min(3, { message: "Must be at least 3 characters" })
    .or(z.literal(""))
    .optional(),
  hours: z.date(),
  minutes: z.date(),
  seconds: z.date(),
});

const NewTaskForm: FC<NewTaskFormProps> = ({ sessionId, break: isBreak }) => {
  const hours = new Date();
  hours.setHours(0);
  const minutes = new Date();
  minutes.setMinutes(25);
  const seconds = new Date();
  seconds.setSeconds(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      hours,
      minutes,
      seconds,
    },
  });

  const { mutate: createMtn, isPending } = useMutation({
    mutationFn: useConvexMutation(api.tasks.mutations.addTask),
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const hours = data.hours.getHours();
    const minutes = data.minutes.getMinutes();
    const seconds = data.seconds.getSeconds();

    const totalDurationMs = ((hours * 60 + minutes) * 60 + seconds) * 1000;
    const DEFAULT_TASK_DESCRIPTION = isBreak ? "Break" : "Task";

    createMtn({
      type: isBreak ? "break" : "task",
      sessionId: sessionId,
      description:
        data.description === "" || !data.description
          ? DEFAULT_TASK_DESCRIPTION
          : data.description,
      duration: totalDurationMs,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Input
                  id="description"
                  placeholder={
                    isBreak
                      ? "What will you be doing on your break?"
                      : "Describe what you'll be achieving"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3">
          <FormField
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="hours">Hours</FormLabel>
                <FormControl>
                  <TimePickerInput
                    picker="hours"
                    className="w-full"
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="minutes">Minutes</FormLabel>
                <FormControl>
                  <TimePickerInput
                    picker="minutes"
                    className="w-full"
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="seconds"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="seconds">Seconds</FormLabel>
                <FormControl>
                  <TimePickerInput
                    picker="seconds"
                    className="w-full"
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button loading={isPending} type="submit" variant="default">
            {isBreak ? "Add Break" : "Add Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewTaskForm;
