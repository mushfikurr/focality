import { useLocalPomodoroTasks } from "@/lib/hooks/use-local-pomodoro-tasks";
import { Task } from "../providers/LocalPomodoroProvider";
import Tasks from "./tasks";

export function LocalTasks() {
  const {
    tasks,
    addTask,
    completeTask,
    deleteTask: removeTask,
    updateTask,
  } = useLocalPomodoroTasks();
  const tasksCompleted = tasks.filter((t: Task) => t.completed).length;
  const tasksRemaining = tasks.length - tasksCompleted;

  const handleAddTask = () => {
    let id = crypto.randomUUID();
    const tasksFiltered: Task[] = tasks.filter((t: Task) => t.type === "task");
    addTask({
      completed: false,
      type: "task",
      description: `Task #${tasksFiltered.length + 1}`,
      duration: 25 * 60,
      id,
    });
  };

  const handleAddBreak = () => {
    let id = crypto.randomUUID();
    const tasksFiltered: Task[] = tasks.filter((t: Task) => t.type === "break");

    addTask({
      completed: false,
      type: "break",
      description: `Break #${tasksFiltered.length + 1}`,
      duration: 5 * 60,
      id,
    });
  };

  return (
    <Tasks
      actions={{
        addBreak: handleAddBreak,
        completeTask: completeTask,
        addTask: handleAddTask,
        removeTask: removeTask,
      }}
      tasks={tasks}
    />
  );
}

function EmptyTasks() {
  return (
    <p className="text-muted-foreground text-sm font-semibold">
      You currently have no tasks. Get started by adding one!
    </p>
  );
}
