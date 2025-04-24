"use client";

import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { FC } from "react";
import { useForm } from "react-hook-form";
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

interface UpdateTaskFormProps {
  task: Doc<"tasks">;
  children?: React.ReactNode;
  onCancel?: any;
  handleEditingChange: (isEditing: boolean) => void;
}

const formSchema = z.object({
  description: z.string().min(3),
  hours: z.date(),
  minutes: z.date(),
  seconds: z.date(),
});

const calculateDates = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const baseDate = new Date(0);
  const hoursDate = new Date(baseDate);
  hoursDate.setHours(hours);
  const minutesDate = new Date(baseDate);
  minutesDate.setMinutes(minutes);
  const secondsDate = new Date(baseDate);
  secondsDate.setSeconds(seconds);

  return {
    hours: hoursDate,
    minutes: minutesDate,
    seconds: secondsDate,
  };
};

const UpdateTaskForm: FC<UpdateTaskFormProps> = ({
  task,
  children,
  handleEditingChange,
}) => {
  const ms = task.duration;
  const { description } = task;
  const { hours, minutes, seconds } = calculateDates(ms);

  const defaults = {
    description,
    hours,
    minutes,
    seconds,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
    values: defaults,
  });

  const updateMtn = useMutation(api.tasks.mutations.updateTask);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const hours = data.hours.getHours();
    const minutes = data.minutes.getMinutes();
    const seconds = data.seconds.getSeconds();

    const totalDurationMs = ((hours * 60 + minutes) * 60 + seconds) * 1000;

    await updateMtn({
      taskId: task._id,
      description: data.description,
      duration: totalDurationMs,
    });

    handleEditingChange(false);
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
                <Input id="description" {...field} />
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

        {children}
      </form>
    </Form>
  );
};

export default UpdateTaskForm;
