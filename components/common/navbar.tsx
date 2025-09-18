"use client";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Compass, Focus, Gauge, LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import UserNavbar from "./user-navbar";
import { Badge } from "../ui/badge";
import { useHideOnScroll } from "@/lib/hooks/use-hide-on-scroll";
import { getLevelFromXP } from "@/lib/client-level";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar({
  user: preloadedUser,
}: {
  user: Preloaded<typeof api.auth.getCurrentUser>;
}) {
  const user = usePreloadedQuery(preloadedUser);
  const { hidden, scrollY } = useHideOnScroll({ scrollOffset: 10 });
  const level = getLevelFromXP(user?.xp ?? 0);

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
      <div className="container mx-auto flex items-center justify-between">
        <div className="-ml-3 flex items-center gap-2">
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
        {user && (
          <div className="flex items-center gap-2">
            <NavItem href="/dashboard" title="Dashboard" icon={Gauge} />
            <NavItem href="/explore" title="Explore" icon={Compass} />
          </div>
        )}
        <div className="flex items-center gap-2">
          {user ? (
            <UserNavbar user={user} />
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                )}
              >
                Register
              </Link>
            </div>
          )}

          {user && (
            <Badge variant="secondary" className="h-fit text-xs">
              Level {level}
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}

type NavItemProps = {
  href: string;
  title: string;
  icon: LucideIcon;
};

function NavItem({ href, title, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname.split("/")[1] === href.substring(1);

  return (
    <Link
      href={href}
      className={cn(
        isActive && "bg-accent",
        buttonVariants({ size: "icon", variant: "ghost" }),
      )}
      title={title}
    >
      <Icon />
    </Link>
  );
}
