import MobileActions from "@/components/room/elements/mobile/mobile-actions";
import { SyncedRoom } from "@/components/room/synced-room";
import { SyncedTasks } from "@/components/tasks/synced-tasks";
import { SyncedTimer } from "@/components/timer/elements/synced-timer";
import { ComponentErrorBoundary } from "@/components/common/error-boundary";
import { preloadSession } from "@/lib/data/server/preload-session";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SessionIdPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const data = await preloadSession(shareId);

  // TODO: If no session data, show an error page?
  if (!data) redirect("/");

  return (
    <div className="container mx-auto flex h-full min-h-0 flex-col gap-4 md:flex-row">
      {/* Left Column */}
      <div className="flex max-h-full flex-col gap-5 pb-5 md:w-4/6">
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between gap-2">
            <Link
              className="text-muted-foreground hover:text-foreground -ml-2 flex items-center gap-1 px-0 py-3.5 text-sm"
              href="/dashboard"
            >
              <ChevronLeft className="aspect-square h-5" />
              <span>Back to dashboard</span>
            </Link>
          </div>

          <ComponentErrorBoundary>
            <SyncedTimer
              preloadedTasks={data.preloadedTasks}
              preloadedSession={data.preloadedSession}
            />
          </ComponentErrorBoundary>
        </div>

        <div className="min-h-0 flex-1">
          <ComponentErrorBoundary>
            <SyncedTasks
              preloadedSession={data.preloadedSession}
              preloadedTasks={data.preloadedTasks}
            />
          </ComponentErrorBoundary>
        </div>

        <div className="flex w-full md:hidden">
          <MobileActions {...data} />
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden h-full flex-col pb-5 md:flex md:w-2/6">
        <div className="h-full">
          <ComponentErrorBoundary>
            <SyncedRoom {...data} />
          </ComponentErrorBoundary>
        </div>
      </div>
    </div>
  );
}
