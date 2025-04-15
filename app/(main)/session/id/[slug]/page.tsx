import { SyncedRoom } from "@/components/room/synced-room";
import Stats from "@/components/stats/stats";
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

  // TODO: When adding joining sessions make sure to implement check if the user is actually in participants list to avoid joining rooms that you are not authenticated to join

  return (
    <div className="container mx-auto flex h-full min-h-0 gap-4">
      {/* Left Column */}
      <div className="flex max-h-full w-4/6 flex-col gap-5 py-5">
        <div className="flex-[1]">
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
      </div>

      {/* Right Column */}
      <div className="flex max-h-full min-h-0 w-2/6 flex-col gap-5 py-5">
        <div className="min-h-[200px] flex-[3]">
          <SyncedRoom
            preloadedUser={preloadedUser}
            preloadedSession={preloadedSession}
            preloadedChat={preloadedChat}
            preloadedRoom={preloadedRoom}
            preloadedParticipants={preloadedParticipants}
          />
        </div>

        <div className="min-h-0 flex-[1]">
          <Stats />
        </div>
      </div>
    </div>
  );
}
