import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { SyncedTimer } from "@/components/timer/elements/synced-timer";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { SyncedTasks } from "@/components/tasks/synced-tasks";

export default async function SessionIdPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const preloadedSession = await preloadQuery(
    api.session.queries.getSession,
    {
      sessionId: slug as Id<"sessions">,
    },
    { token: await convexAuthNextjsToken() },
  );
  const preloadedTasks = await preloadQuery(
    api.tasks.queries.listTasks,
    {
      sessionId: slug as Id<"sessions">,
    },
    { token: await convexAuthNextjsToken() },
  );

  return (
    <div className="container mx-auto grid min-h-0 flex-1 grid-cols-1 gap-6 py-8 lg:grid-cols-3">
      <section className="col-span-1 flex min-h-0 flex-col gap-y-8 lg:col-span-2">
        <div className="shrink-0">
          <SyncedTimer
            preloadedSession={preloadedSession}
            preloadedTasks={preloadedTasks}
          />
        </div>
        <div className="min-h-0 flex-1">
          <SyncedTasks sessionId={slug} preloadedTasks={preloadedTasks} />
        </div>
      </section>
      <section className="flex flex-col gap-y-8 lg:col-span-1">
        <div className="shrink-0">{/* <Room /> */}</div>

        <div className="min-h-0 flex-1">{/* <Stats /> */}</div>
      </section>
    </div>
  );
}
