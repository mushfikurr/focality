"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Skeleton } from "../ui/skeleton";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(3, {
      message: "Description must be at least 3 characters",
    })
    .optional(),
  visibility: z.boolean(),
});

export default function NewSessionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: false,
    },
  });

  const createSession = useMutation(api.session.mutations.createSession);

  const [isLoading, setIsLoading] = useState(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const sessionId = await createSession({
      title: values.title,
      description: values.description,
      visibility: values.visibility ? "public" : "private",
    }).finally(() => setIsLoading(false));
    redirect(`/session/id/${sessionId}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="title">Title</FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    placeholder="Study Session"
                    type="title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <div className="flex items-center justify-between">
                  <FormLabel htmlFor="description">Description</FormLabel>
                </div>
                <FormControl>
                  <Input
                    id="description"
                    type="description"
                    placeholder="A session for studying"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Checkbox
                      className="rounded-none"
                      id="visibility"
                      {...field}
                    />
                  </FormControl>
                  <FormLabel htmlFor="description">
                    Make session joinable
                  </FormLabel>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-3">
            <Button
              type="submit"
              className="w-fit"
              disabled={!form.formState.isValid}
              loading={isLoading}
            >
              Start Focusing
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export function NewSessionFormSkeleton() {
  return (
    <div className="w-full space-y-8">
      <div className="grid gap-8">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="w-full" />
      </div>
    </div>
  );
}
