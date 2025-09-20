"use client";
import { api } from "@/convex/_generated/api";
import { useSimplePaginatedQuery } from "@/lib/hooks/use-convex-tanstack-table";
import { PaginatedQueryItem } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { Search } from "lucide-react";
import { useState } from "react";
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

type Session = PaginatedQueryItem<
  typeof api.session.queries.paginatedPublicSessions
>;

function SessionList() {
  const { status, loadNext, loadPrev, currentResults, currentPageNum } =
    useSimplePaginatedQuery(
      api.session.queries.paginatedPublicSessions,
      {},
      { initialNumItems: 9 },
    );
  const [searchQuery, setSearchQuery] = useState("");

  const sessions: Session[] = status === "loaded" ? currentResults.page : [];

  const filteredSessions = sessions.filter(
    (s): s is Session =>
      !!s?.title && s.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={status !== "loaded"}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-3 lg:grid-cols-4">
            {status === "loading" &&
              Array.from({ length: 3 }).map((_, i) => (
                <SessionCardSkeleton key={i} />
              ))}
            {status === "loaded" &&
              filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
          </div>
        </ScrollArea>

        {status === "loaded" && filteredSessions.length === 0 && (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No sessions found."
                : "No public sessions to view."}
            </p>
          </div>
        )}
      </div>

      {status === "loaded" && sessions.length > 0 && (
        <div className="bg-background sticky bottom-0 z-10 py-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">
              Page {currentPageNum}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => loadPrev?.()}
                disabled={!loadPrev || status !== "loaded"}
              >
                Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => loadNext?.()}
                disabled={!loadNext || status !== "loaded"}
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
