"use client";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Focus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import UserNavbar from "./user-navbar";
import { Badge } from "../ui/badge";
import { useHideOnScroll } from "@/lib/hooks/use-hide-on-scroll";

export default function Navbar({
  user: preloadedUser,
}: {
  user: Preloaded<typeof api.auth.getCurrentUser>;
}) {
  const user = usePreloadedQuery(preloadedUser);
  const { hidden, scrollY } = useHideOnScroll({ scrollOffset: 10 });

  return (
    <header
      className={cn(
        "bg-background/90 sticky top-0 z-50 py-3 backdrop-blur-sm",
        "transition-[transform_300ms,opacity_300ms,filter_300ms,box-shadow] duration-300 ease-out",
        hidden
          ? "-translate-y-full opacity-0 blur-sm"
          : "translate-y-0 opacity-100 blur-none",
        scrollY > 0 ? "shadow-xs" : "shadow-none",
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-secondary-foreground flex items-center gap-3"
        >
          <Focus className="h-5 w-5" />
          <Badge
            title="This project is currently under heavy development and some features may not be implemented yet."
            variant="secondary"
            className="text-xs"
          >
            Alpha
          </Badge>
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
