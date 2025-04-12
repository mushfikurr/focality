"use client";

import { cn } from "@/lib/utils";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import UserNavbar, { UserTriggerSkeleton } from "./user-navbar";

export default function Navbar({ className }: { className?: string }) {
  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b py-3 shadow-xs backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight italic">
          <Link href="/">focality</Link>
        </h1>
        <AuthLoading>
          <UserTriggerSkeleton />
        </AuthLoading>
        <Authenticated>
          <UserNavbar />
        </Authenticated>
        <Unauthenticated>
          <div className="flex space-x-3">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "px-3 py-1 text-sm",
              )}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "px-3 py-1 text-sm",
              )}
            >
              Register
            </Link>
          </div>
        </Unauthenticated>
      </div>
    </header>
  );
}
