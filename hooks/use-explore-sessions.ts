import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";
import { PaginatedQueryItem } from "convex/react";
import { useMemo } from "react";

type Session = PaginatedQueryItem<
  typeof api.session.queries.paginatedPublicSessions
>;

export function useExploreSessions(searchQuery: string) {
  const { data: sessionsData, isPending } = useQuery(
    convexQuery(api.session.queries.paginatedPublicSessions, {
      paginationOpts: { numItems: 9, cursor: null },
      search: searchQuery,
    }),
  );

  const sessions: Session[] = useMemo(
    () => sessionsData?.page || [],
    [sessionsData],
  );

  const filteredSessions = useMemo(
    () =>
      sessions.filter(
        (s): s is Session =>
          !!s?.title &&
          s.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [sessions, searchQuery],
  );

  return {
    sessions: filteredSessions,
    isPending,
  };
}
