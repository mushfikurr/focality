import { api } from "@/convex/_generated/api";
import { preloadWithAuth } from "@/lib/preload-with-auth";
import { fetchQuery } from "convex/nextjs";
import { preloadUser } from "./preload-user";
import { getToken } from "./token";

export async function preloadSession(shareId: string) {
  const token = await getToken();

  const sessionByShareIdQuery = await fetchQuery(
    api.session.queries.getSessionByShareId,
    { shareId },
    { token },
  );

  if (!sessionByShareIdQuery) return null;
  const { session } = sessionByShareIdQuery;

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
