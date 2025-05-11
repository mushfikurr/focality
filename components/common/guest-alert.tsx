"use client";

import { useGuest } from "@/lib/hooks/use-guest";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function GuestAlert({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const { user, isLoading } = useGuest({ isAuthenticated });
  if (!user) return <GuestAlertSkeleton />;
  if (!user?.isAnonymous) return null;

  return (
    <div className="container mx-auto pt-8">
      <Alert>
        <AlertTitle>Focality as a guest</AlertTitle>
        <AlertDescription>
          As a guest, we cannot guarantee your sessions will save successfully
          between visits.
          <p className="text-foreground mt-2">
            <Link
              className="text-primary hover:text-primary/80 underline transition-colors duration-300 ease-in-out"
              href="/login"
            >
              Login
            </Link>{" "}
            or{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 underline transition-colors duration-300 ease-in-out"
            >
              Register
            </Link>{" "}
            an account
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function GuestAlertSkeleton() {
  return (
    <div className="container mx-auto pt-8">
      <div className="bg-card w-full rounded-lg border px-4 py-3">
        <div className="bg-muted mb-2 h-4 w-40 animate-pulse rounded" />
        <div className="bg-muted mb-3 h-3 w-64 animate-pulse rounded" />
        <div className="bg-muted h-3 w-64 animate-pulse rounded" />
      </div>
    </div>
  );
}
