import { TasksSkeleton } from "@/components/tasks/skeleton";
import { SessionSkeleton } from "@/components/timer/elements/skeleton";

export default function SessionPageLoading() {
  return (
    <div className="container mx-auto grid min-h-0 flex-1 grid-cols-1 gap-6 pt-4 pb-8 lg:grid-cols-3">
      <section className="col-span-1 flex min-h-0 flex-col gap-y-8 lg:col-span-2">
        <div className="shrink-0">
          <SessionSkeleton />
        </div>
        <div className="min-h-0 flex-1">
          <TasksSkeleton />
        </div>
      </section>
      <section className="flex flex-col gap-y-8 lg:col-span-1">
        <div className="shrink-0">{/* <Room /> */}</div>
      </section>
    </div>
  );
}
