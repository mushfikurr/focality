import { TasksSkeleton } from "@/components/tasks/skeleton";
import { SessionSkeleton } from "@/components/timer/elements/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SessionLoading() {
  return (
    <div className="container mx-auto grid min-h-0 flex-1 grid-cols-1 gap-6 py-8 lg:grid-cols-3">
      {/* Left Section (2 cols on large) */}
      <section className="col-span-1 flex min-h-0 flex-col gap-y-8 lg:col-span-2">
        {/* Current Session Card */}
        <div className="shrink-0">
          <SessionSkeleton />
        </div>

        {/* Session Tasks Card */}
        <div className="min-h-0 flex-1">
          <TasksSkeleton />
        </div>
      </section>

      {/* Right Sidebar */}
      <section className="flex flex-col gap-y-8 lg:col-span-1">
        <div className="shrink-0">
          <Skeleton className="bg-card h-22 w-full border" />
        </div>
        <div className="min-h-0 flex-1" />
      </section>
    </div>
  );
}
