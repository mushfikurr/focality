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
import { cn } from "@/lib/utils";
import { Compass, LayoutDashboard, Plus, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePreloadedQuery } from "convex/react";
import { Preloaded } from "convex/react";
import { RecentSessionsList } from "./recent-sessions-list";
import { api } from "@/convex/_generated/api";

const items = [
  {
    groupTitle: "Quick Access",
    items: [
      { icon: LayoutDashboard, title: "Dashboard", href: "/dashboard" },
      { icon: Compass, title: "Explore Sessions", href: "/explore" },
      { icon: User2, title: "Profile", href: "/profile" },
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
  preloadedSessions,
}: {
  preloadedSessions: Preloaded<
    typeof api.session.queries.getRecentSessionsForUser
  >;
}) {
  const sessions = usePreloadedQuery(preloadedSessions);

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
