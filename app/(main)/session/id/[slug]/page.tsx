import MobileActions from "@/components/room/elements/mobile/mobile-actions";
import { SyncedRoom } from "@/components/room/synced-room";
import { SyncedTasks } from "@/components/tasks/synced-tasks";
import { SyncedTimer } from "@/components/timer/elements/synced-timer";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadWithAuth } from "@/lib/preload-with-auth";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function SessionIdPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const data = await preloadStatistics(slug as Id<"sessions">);

  return (
    <div className="container mx-auto flex h-full min-h-0 flex-col gap-4 md:flex-row">
      {/* Left Column */}
      <div className="flex max-h-full flex-col gap-5 py-5 md:w-4/6">
        <div className="flex flex-col flex-1">
          <div>
            <Link
              className="py-3.5 text-xs px-0 text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              href="/dashboard"
            >
              <ChevronLeft className="h-3 w-3" /> Back to dashboard
            </Link>
          </div>

          <SyncedTimer
            preloadedTasks={data.preloadedTasks}
            preloadedSession={data.preloadedSession}
          />

        </div>

        <div className="min-h-0 flex-1">
          <SyncedTasks
            sessionId={slug as Id<"sessions">}
            preloadedSession={data.preloadedSession}
            preloadedTasks={data.preloadedTasks}
          />
        </div>

        <div className="flex w-full md:hidden">
          <MobileActions {...data} />
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden h-full flex-col py-5 md:flex md:w-2/6">
        <div className="h-full">
          <SyncedRoom {...data} />
        </div>

        {/* <div className="min-h-0 flex-[1]">
          <Stats />
        </div> */}
      </div>
    </div >
  );
}


export async function preloadStatistics(slug: Id<"sessions">) {
  const sessionIdArgs = { sessionId: slug };
  const preloadedUser = await preloadWithAuth(api.user.currentUser);
  const preloadedSession = await preloadWithAuth(
    api.session.queries.getSession,
    sessionIdArgs
  );
  const preloadedTasks = await preloadWithAuth(
    api.tasks.queries.listTasks,
    sessionIdArgs
  );
  const preloadedChat = await preloadWithAuth(
    api.chat.queries.listChatMessages,
    sessionIdArgs
  );
  const preloadedParticipants = await preloadWithAuth(
    api.rooms.queries.listParticipants,
    sessionIdArgs
  );
  const preloadedRoom = await preloadWithAuth(
    api.rooms.queries.getRoomBySession,
    sessionIdArgs
  );

  return {
    preloadedUser,
    preloadedSession,
    preloadedTasks,
    preloadedChat,
    preloadedParticipants,
    preloadedRoom,
  }
}

