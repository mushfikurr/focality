"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { SessionSkeleton } from "./elements/skeleton";

export default function SessionTimer() {
  return (
    <>
      <AuthLoading>
        <SessionSkeleton />
      </AuthLoading>
    </>
  );
}
