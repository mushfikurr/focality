"use client";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Focus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import UserNavbar from "./user-navbar";

export default function Navbar({
  user: preloadedUser,
}: {
  user: Preloaded<typeof api.auth.getCurrentUser>;
}) {
  const user = usePreloadedQuery(preloadedUser);

  return (
    <header className="bg-background/60 sticky top-0 z-50 py-2 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-secondary-foreground">
          <Focus className="h-5 w-5" />
        </Link>
        {user ? (
          <UserNavbar user={user} />
        ) : (
          <div className="flex gap-2">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
