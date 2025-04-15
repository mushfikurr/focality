"use client";

import { Plus } from "lucide-react";
import { Task } from "../providers/LocalPomodoroProvider";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Scroller } from "../ui/scroller";
import { TaskItem } from "./task-item";
import { cn } from "@/lib/utils";

type ActionFunction = () => void | Promise<void>;
type ActionFunctionWithId = (taskId: string) => void | Promise<void>;
type UpdateActionFunctionWithId = (
  taskId: string,
  task: Partial<Task>,
) => void | Promise<void>;

interface TasksProps {
  tasks: Task[];
  actions: {
    addTask: ActionFunction;
    addBreak: ActionFunction;
    updateTask: UpdateActionFunctionWithId;
    removeTask: ActionFunctionWithId;
    completeTask: ActionFunctionWithId;
  };
  currentTaskId?: string;
  pending?: {
    removeTask?: boolean;
  };
}

export default function Tasks(props: TasksProps) {
  const { tasks, actions, currentTaskId } = props;

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
        <CardDescription className="text-balance">
          Treat these as focused session blocks. You can add, remove, and
          complete them as you go.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col overflow-auto py-1">
        <Scroller
          className={cn(
            "max-h-full overflow-auto",
            !!tasks.length && "shadow-sm",
          )}
        >
          {!!tasks?.length ? (
            tasks.map((t: Task) => (
              <TaskItem
                key={t.id}
                task={t}
                removeTask={() => actions.removeTask(t.id)}
                updateTask={actions.updateTask}
                currentTaskId={currentTaskId}
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
    <p className="text-muted-foreground text-sm">
      You currently have no tasks. Get started by adding one!
    </p>
  );
}
