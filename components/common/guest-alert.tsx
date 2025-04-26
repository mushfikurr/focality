"use client";

import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function GuestAlert({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const actions = useAuthActions();

  useEffect(() => {
    if (!isAuthenticated) {
      actions.signIn("anonymous");
    }
  }, [actions, isAuthenticated]);

  const user = useQuery(api.user.currentUser);

  if (!user?.isAnonymous) return;

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
