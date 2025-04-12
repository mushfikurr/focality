"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Chat } from "./chat";
import PariticpantList from "./participant-list";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export default function Room() {
  return (
    <>
      <AuthLoading>
        <Skeleton className="bg-card h-22 w-full border" />
      </AuthLoading>
      <Unauthenticated>
        <UnauthenticatedRoom />
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedRoom />
      </Authenticated>
    </>
  );
}

export function AuthenticatedRoom() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <h1>Room: Sample Room</h1>
          <p className="text-muted-foreground text-xs">ID: 123456789</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full space-y-4 text-sm">
        <PariticpantList />
        <Chat />
      </CardContent>
    </Card>
  );
}

export function UnauthenticatedRoom() {
  return (
    <Card>
      <CardContent className="flex h-full items-center justify-between gap-6">
        <p className="text-muted-foreground text-sm font-medium text-balance">
          Login to gain access to multiplayer, levelling, and much more.
        </p>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Login
        </Link>
      </CardContent>
    </Card>
  );
}
