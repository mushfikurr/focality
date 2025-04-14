"use client";

import { Plus } from "lucide-react";
import { Task } from "../providers/LocalPomodoroProvider";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Scroller } from "../ui/scroller";
import { TaskItem } from "./task-item";
import { cn } from "@/lib/utils";

type ActionFunction = () => void | Promise<void>;
type ActionFunctionWithId = (taskId: string) => void | Promise<void>;

interface TasksProps {
  tasks: Task[];
  actions: {
    addTask: ActionFunction;
    addBreak: ActionFunction;
    removeTask: ActionFunctionWithId;
    completeTask: ActionFunctionWithId;
  };
  pending?: {
    removeTask?: boolean;
  };
}

export default function Tasks(props: TasksProps) {
  const { tasks, actions } = props;

  const tasksCompleted = tasks?.filter((t: Task) => t.completed).length;
  const tasksRemaining = tasks ? tasks.length - tasksCompleted : 0;

  return (
    <Card className="max-h-full min-h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <h3>Session Tasks</h3>
          <div className="-mr-2 flex gap-0 text-xs">
            <Button variant="ghost" size="sm" onClick={actions.addBreak}>
              <Plus className="mr-1" /> Add Break
            </Button>
            <Button variant="ghost" size="sm" onClick={actions.addTask}>
              <Plus className="mr-1" /> Add Task
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col overflow-auto">
        <Scroller className="max-h-full overflow-auto">
          {!!tasks?.length ? (
            tasks.map((t: Task) => (
              <TaskItem
                key={t.id}
                task={t}
                removeTask={() => actions.removeTask(t.id)}
              />
            ))
          ) : (
            <EmptyTasks />
          )}
        </Scroller>
      </CardContent>
      <CardFooter className="text-xs">
        <div className="text-muted-foreground flex h-full gap-3">
          <div
            className={cn(
              "flex h-full items-center gap-3 pr-3",
              !!tasksRemaining && "border-r",
            )}
          >
            <div className="bg-primary aspect-square h-4"></div>

            {!!tasksCompleted && <p>{tasksCompleted} task completed</p>}
            {!!!tasksCompleted && <p>Awaiting tasks</p>}
          </div>
          {!!tasksRemaining && <p>{tasksRemaining} remaining</p>}
        </div>
      </CardFooter>
    </Card>
  );
}

function EmptyTasks() {
  return (
    <p className="text-muted-foreground text-sm font-semibold">
      You currently have no tasks. Get started by adding one!
    </p>
  );
}
