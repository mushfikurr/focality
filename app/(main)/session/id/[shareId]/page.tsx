import MobileActions from "@/components/room/elements/mobile/mobile-actions";
import { SyncedRoom } from "@/components/room/synced-room";
import { SyncedTasks } from "@/components/tasks/synced-tasks";
import { SyncedTimer } from "@/components/timer/elements/synced-timer";
import { api } from "@/convex/_generated/api";
import { createAuth } from "@/lib/auth";
import redirectIfNotAuthenticated from "@/lib/data/server/is-authenticated";
import { preloadWithAuth } from "@/lib/preload-with-auth";
import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function SessionIdPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  await redirectIfNotAuthenticated();
  const { shareId } = await params;
  const data = await preloadStatistics(shareId);

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

          <SyncedTimer
            preloadedTasks={data.preloadedTasks}
            preloadedSession={data.preloadedSession}
          />
        </div>

        <div className="min-h-0 flex-1">
          <SyncedTasks
            preloadedSession={data.preloadedSession}
            preloadedTasks={data.preloadedTasks}
          />
        </div>

        <div className="flex w-full md:hidden">
          <MobileActions {...data} />
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden h-full flex-col pb-5 md:flex md:w-2/6">
        <div className="h-full">
          <SyncedRoom {...data} />
        </div>

        {/* <div className="min-h-0 flex-[1]">
          <Stats />
        </div> */}
      </div>
    </div>
  );
}

export async function preloadStatistics(shareId: string) {
  const token = await getToken(createAuth);
  const { session } = await fetchQuery(
    api.session.queries.getSessionByShareId,
    { shareId },
    { token },
  );
  const sessionIdArgs = { sessionId: session._id };
  const preloadedUser = await preloadWithAuth(api.auth.getCurrentUser);
  const preloadedSession = await preloadWithAuth(
    api.session.queries.getSession,
    sessionIdArgs,
  );
  const preloadedTasks = await preloadWithAuth(
    api.tasks.queries.listTasks,
    sessionIdArgs,
  );
  const preloadedChat = await preloadWithAuth(
    api.chat.queries.listChatMessages,
    sessionIdArgs,
  );
  const preloadedParticipants = await preloadWithAuth(
    api.session.queries.listParticipants,
    sessionIdArgs,
  );

  return {
    preloadedUser,
    preloadedSession,
    preloadedTasks,
    preloadedChat,
    preloadedParticipants,
  };
}
