"use client";
import { formatDistanceToNowStrict } from "date-fns";
import { Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { JoinSessionButton } from "../session/join-session-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area/scroll-area";
import { useExploreSessions } from "@/hooks/use-explore-sessions";

function SessionList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  const { sessions: filteredSessions, isPending } = useExploreSessions(
    page,
    searchQuery,
  );

  const updateUrl = useCallback(
    (page: number, search: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      if (search) params.set("search", search);
      router.replace(`?${params}`, { scroll: false });
    },
    [searchParams, router],
  );

  const handleLoadNext = useCallback(() => {
    updateUrl(page + 1, searchQuery);
  }, [page, searchQuery, updateUrl]);

  const handleLoadPrev = useCallback(() => {
    updateUrl(page - 1, searchQuery);
  }, [page, searchQuery, updateUrl]);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="bg-background sticky top-0 z-10 py-2">
        <div className="flex items-center gap-2">
          <Search className="text-muted-foreground mr-2 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search sessions..."
            className="w-full max-w-xs py-1 pr-2 text-sm"
            value={searchQuery}
            onChange={(e) => {
              const newQuery = e.target.value;
              updateUrl(page, newQuery);
            }}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-3 lg:grid-cols-4">
            {isPending &&
              Array.from({ length: 3 }).map((_, i) => (
                <SessionCardSkeleton key={i} />
              ))}
            {!isPending &&
              filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
          </div>
        </ScrollArea>

        {!isPending && filteredSessions.length === 0 && (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No sessions found."
                : "No public sessions to view."}
            </p>
          </div>
        )}
      </div>

      {!isPending && filteredSessions.length > 0 && (
        <div className="bg-background sticky bottom-0 z-10 py-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Page {page}</span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={handleLoadPrev}
                disabled={page <= 1 || isPending}
              >
                Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={handleLoadNext}
                disabled={isPending}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-[70px]" />
      </CardFooter>
    </Card>
  );
}

function SessionCard({ session }: { session?: Session }) {
  if (!session) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1.5">
          <CardTitle>{session.title}</CardTitle>
          {session.description && (
            <CardDescription>{session.description}</CardDescription>
          )}
        </div>
        <Badge variant={session.running ? "default" : "secondary"}>
          {session.running ? "Focusing" : "Waiting"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-1.5 text-sm">
        <p>{session.participantAmount ?? 0} participants</p>
        <p>Focused for {formatDistanceToNowStrict(session.creationTime)}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        {session.host ? (
          <div className="flex items-center gap-3 text-sm">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.host.image} />
              <AvatarFallback>
                {session.host.name?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p>Hosted by {session.host.name}</p>
          </div>
        ) : (
          <div />
        )}
        <JoinSessionButton
          session={{ ...session, _id: session.id }}
          variant="secondary"
          size="sm"
        >
          Join
        </JoinSessionButton>
      </CardFooter>
    </Card>
  );
}

export default SessionList;
