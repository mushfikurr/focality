"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import NewTaskForm from "../forms/new-task-form";
import { CoffeeIcon } from "../ui/animated-icons/coffee-icon";
import { AnimatedButton } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Scroller } from "../ui/scroller";
import { MobileAddButton } from "./mobile-add-button";
import { TaskItem } from "./task-item";
import { SquarePenIcon } from "../ui/animated-icons/square-pen";

type ActionFunction = () => void | Promise<void>;
type ActionFunctionWithId = (taskId: string) => void | Promise<void>;
type UpdateActionFunctionWithId = (
  taskId: string,
  task: Partial<Doc<"tasks">>,
) => void | Promise<void>;

interface TasksProps {
  tasks: Doc<"tasks">[];
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
  sessionId: Id<"sessions">;
}

export default function Tasks(props: TasksProps) {
  const { tasks, actions, currentTaskId, sessionId } = props;

  const tasksCompleted = tasks?.filter((t) => t.completed).length;
  const tasksRemaining = tasks ? tasks.length - tasksCompleted : 0;

  return (
    <Card className="max-h-full min-h-0 gap-0 overflow-hidden md:gap-3">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <h3>Session Tasks</h3>
          <div className="-mr-2 hidden gap-0 text-xs md:flex">
            <AddBreakButton sessionId={sessionId} />
            <AddTaskButton sessionId={sessionId} />
          </div>
          <MobileAddButton actions={actions} />
        </CardTitle>
        <CardDescription className="hidden md:block">
          Treat these as focused session blocks. You can add, remove, and
          complete them as you go.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col overflow-auto py-1">
        <Scroller
          className={cn(
            "max-h-full overflow-auto",
            !!tasks.length && "border-b",
          )}
        >
          {!!tasks?.length ? (
            tasks.map((t) => (
              <TaskItem
                key={t._id}
                task={t}
                removeTask={() => actions.removeTask(t._id)}
                updateTask={actions.updateTask}
                currentTaskId={currentTaskId}
              />
            ))
          ) : (
            <EmptyTasks />
          )}
        </Scroller>
      </CardContent>
      <CardFooter className="hidden text-xs md:block">
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

const AddBreakButton: React.FC<{
  sessionId: Id<"sessions">;
}> = ({ sessionId }) => (
  <Dialog>
    <DialogTrigger asChild>
      <AnimatedButton variant="ghost" size="sm" icon={<CoffeeIcon />}>
        Add Break
      </AnimatedButton>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add a new break</DialogTitle>
        <DialogDescription>Time to recharge your focus.</DialogDescription>
      </DialogHeader>
      <NewTaskForm sessionId={sessionId} break />
    </DialogContent>
  </Dialog>
);

const AddTaskButton: React.FC<{
  sessionId: Id<"sessions">;
}> = ({ sessionId }) => (
  <Dialog>
    <DialogTrigger asChild>
      <AnimatedButton variant="ghost" size="sm" icon={<SquarePenIcon />}>
        Add Task
      </AnimatedButton>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add a new task</DialogTitle>
        <DialogDescription>
          A task is a block of time to focus on something that needs doing.
        </DialogDescription>
      </DialogHeader>
      <NewTaskForm sessionId={sessionId} />
    </DialogContent>
  </Dialog>
);

function EmptyTasks() {
  return (
    <p className="text-muted-foreground text-sm">
      You currently have no tasks. Get started by adding one!
    </p>
  );
}
