"use client";

import { cn } from "@/lib/utils";
import { AuthLoading, Unauthenticated } from "convex/react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Card, CardContent } from "../ui/card";
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
    </>
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
