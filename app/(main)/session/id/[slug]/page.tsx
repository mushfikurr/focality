import MobileActions from "@/components/room/elements/mobile/mobile-actions";
import { SyncedRoom } from "@/components/room/synced-room";
import { SyncedTasks } from "@/components/tasks/synced-tasks";
import { SyncedTimer } from "@/components/timer/elements/synced-timer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";

export default async function SessionIdPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const preloadedUser = await preloadQuery(api.user.currentUser);
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
  const preloadedChat = await preloadQuery(
    api.chat.queries.listChatMessages,
    {
      sessionId: slug as Id<"sessions">,
    },
    { token: await convexAuthNextjsToken() },
  );
  const preloadedParticipants = await preloadQuery(
    api.rooms.queries.listParticipants,
    {
      sessionId: slug as Id<"sessions">,
    },
    { token: await convexAuthNextjsToken() },
  );
  const preloadedRoom = await preloadQuery(
    api.rooms.queries.getRoomBySession,
    {
      sessionId: slug as Id<"sessions">,
    },
    { token: await convexAuthNextjsToken() },
  );

  const preloadedProps = {
    preloadedChat: preloadedChat,
    preloadedParticipants: preloadedParticipants,
    preloadedRoom: preloadedRoom,
    preloadedSession: preloadedSession,
    preloadedUser: preloadedUser,
  };

  return (
    <div className="container mx-auto flex h-full min-h-0 flex-col gap-4 md:flex-row">
      {/* Left Column */}
      <div className="flex max-h-full flex-col gap-5 py-5 md:w-4/6">
        <div className="flex-1">
          <SyncedTimer
            preloadedTasks={preloadedTasks}
            preloadedSession={preloadedSession}
          />
        </div>

        <div className="min-h-0 flex-1">
          <SyncedTasks
            sessionId={slug as Id<"sessions">}
            preloadedSession={preloadedSession}
            preloadedTasks={preloadedTasks}
          />
        </div>

        <div className="flex w-full md:hidden">
          <MobileActions {...preloadedProps} />
        </div>
      </div>

      {/* Right Column */}
      <div className="hidden h-full flex-col py-5 md:flex md:w-2/6">
        <div className="h-full">
          <SyncedRoom {...preloadedProps} />
        </div>

        {/* <div className="min-h-0 flex-[1]">
          <Stats />
        </div> */}
      </div>
    </div>
  );
}
