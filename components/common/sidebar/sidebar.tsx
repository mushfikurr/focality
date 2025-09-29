"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Preloaded, useConvexAuth, usePreloadedQuery } from "convex/react";
import { Compass, LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RecentSessionsList } from "./recent-sessions-list";

const items = [
  {
    groupTitle: "Quick Access",
    items: [
      { icon: LayoutDashboard, title: "Dashboard", href: "/dashboard" },
      { icon: Compass, title: "Explore Sessions", href: "/explore" },
    ],
  },
];

function SidebarNav({
  sessions,
}: {
  sessions: { id: string; shareId: string; title: string }[];
}) {
  const pathname = usePathname();
  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.groupTitle}>
          <SidebarGroupLabel>{group.groupTitle}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(
                      item.href.startsWith(pathname) &&
                        "bg-sidebar-accent text-sidebar-accent-foreground",
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
      <RecentSessionsList sessions={sessions} />
    </>
  );
}

export function AppSidebar({
  preloadedSessions: preloadedSessionsQuery,
}: {
  preloadedSessions: Preloaded<
    typeof api.session.queries.getRecentSessionsForUser
  >;
}) {
  const { isLoading } = useConvexAuth();
  const preloadedSessions = usePreloadedQuery(preloadedSessionsQuery);
  const [sessions, setSessions] = useState(preloadedSessions);
  useEffect(() => {
    if (!isLoading) {
      setSessions(preloadedSessions);
    }
  }, [preloadedSessions, isLoading]);

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-2 pb-0">
          <SidebarMenuButton variant="outline" asChild>
            <Link href="/session/new">
              <Plus /> New Session
            </Link>
          </SidebarMenuButton>
        </div>
        <SidebarNav sessions={sessions} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
