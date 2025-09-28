import { api } from "@/convex/_generated/api";
import { getToken } from "./token";
import { fetchQuery } from "convex/nextjs";
import { preloadUser } from "./preload-user";
import { preloadWithAuth } from "@/lib/preload-with-auth";

export async function preloadSession(shareId: string) {
  const token = await getToken();
  const { session } = await fetchQuery(
    api.session.queries.getSessionByShareId,
    { shareId },
    { token },
  );

  const sessionIdArgs = { sessionId: session._id };

  const [
    preloadedUser,
    preloadedSession,
    preloadedTasks,
    preloadedChat,
    preloadedParticipants,
  ] = await Promise.all([
    preloadUser(),
    preloadWithAuth(api.session.queries.getSession, sessionIdArgs),
    preloadWithAuth(api.tasks.queries.listTasks, sessionIdArgs),
    preloadWithAuth(api.chat.queries.listChatMessages, sessionIdArgs),
    preloadWithAuth(api.session.queries.listParticipants, sessionIdArgs),
  ]);

  return {
    preloadedUser,
    preloadedSession,
    preloadedTasks,
    preloadedChat,
    preloadedParticipants,
  };
}
