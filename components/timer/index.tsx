"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { SessionSkeleton } from "./elements/skeleton";
import { LocalTimer } from "./elements/local-timer";

export default function SessionTimer() {
  return (
    <>
      <AuthLoading>
        <SessionSkeleton />
      </AuthLoading>
      <Unauthenticated>
        <LocalTimer />
      </Unauthenticated>
    </>
  );
}
