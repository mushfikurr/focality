"use client";

import { api } from "@/convex/_generated/api";
import { getLevelFromXP } from "@/lib/client-level";
import { useHideOnScroll } from "@/lib/hooks/use-hide-on-scroll";
import { cn } from "@/lib/utils";
import { Preloaded, useConvexAuth, usePreloadedQuery } from "convex/react";
import { Award, Focus } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { NavUser } from "./nav-user";
import { useEffect, useState } from "react";

function ConditionalSidebarTrigger() {
  try {
    useSidebar();
    return <SidebarTrigger />;
  } catch {
    return null;
  }
}

export default function Navbar({
  user: preloadedUser,
}: {
  user: Preloaded<typeof api.auth.getCurrentUser>;
}) {
  const { isLoading } = useConvexAuth();
  const user = usePreloadedQuery(preloadedUser);
  const [currentUser, setCurrentUser] = useState(user);
  useEffect(() => {
    if (!isLoading) {
      setCurrentUser(user);
    }
  }, [user, isLoading]);

  const { hidden, scrollY } = useHideOnScroll({ scrollOffset: 10 });
  const level = getLevelFromXP(currentUser?.xp ?? 0);

  return (
    <header
      className={cn(
        "bg-background/90 sticky top-0 z-50 py-2 backdrop-blur-sm",
        "transition-[transform_300ms,opacity_300ms,filter_300ms,box-shadow] duration-300 ease-out",
        hidden
          ? "-translate-y-full opacity-0 blur-sm"
          : "translate-y-0 opacity-100 blur-none",
        scrollY > 0 ? "shadow-xs" : "shadow-none",
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-between">
        <div className="-ml-2 flex h-full items-center gap-2">
          <ConditionalSidebarTrigger />
          <Separator orientation="vertical" className="max-h-6" />
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "text-secondary-foreground flex items-center gap-3",
            )}
          >
            <Focus className="h-5 w-5" />
          </Link>
          <Badge
            title="This project is currently under heavy development and some features may not be implemented yet."
            variant="secondary"
            className="text-xs"
          >
            Development
          </Badge>
        </div>
        {currentUser ? (
          <div className="flex h-full items-center gap-4">
            <div className="flex items-center justify-center gap-1.5 rounded border px-2 pl-1.5 drop-shadow-xs">
              <Award className="size-4" strokeWidth={2.5} />
              <p>{level}</p>
            </div>
            <Separator orientation="vertical" className="max-h-6" />
            <NavUser user={currentUser} />
          </div>
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
