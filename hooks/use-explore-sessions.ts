import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import { PaginatedQueryItem } from "convex/react";
import { useMemo } from "react";

type Session = PaginatedQueryItem<
  typeof api.session.queries.paginatedPublicSessions
>;

export function useExploreSessions(
  searchQuery: string,
  cursor: string | null = null,
) {
  const { data: sessionsData, isPending } = useQuery(
    convexQuery(api.session.queries.paginatedPublicSessions, {
      paginationOpts: { numItems: 9, cursor },
    }),
  );

  const sessions: Session[] = useMemo(
    () => sessionsData?.page || [],
    [sessionsData],
  );

  // Filter sessions: remove those without titles and apply search filtering
  const filteredSessions = useMemo(
    () =>
      sessions.filter(
        (s): s is Session =>
          !!s?.title &&
          (!searchQuery ||
            s.title.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    [sessions, searchQuery],
  );

  return {
    sessions: filteredSessions,
    isPending,
    isDone: sessionsData?.isDone ?? false,
    continueCursor: sessionsData?.continueCursor ?? null,
  };
}
