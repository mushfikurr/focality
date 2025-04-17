"use client";

import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";

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

  return (
    <Alert>
      <AlertTitle>Continuing as a guest</AlertTitle>
      <AlertDescription>
        As a guest, we cannot guarantee your sessions will synchronise well. To
        access the full suite of features:
        <p className="text-foreground">
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
  );
}
