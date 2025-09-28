"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SessionMenu } from "./session-menu";

interface Session {
  id: string;
  shareId: string;
  title: string;
}

interface RecentSessionsListProps {
  sessions: Session[];
}

export function RecentSessionsList({ sessions }: RecentSessionsListProps) {
  if (sessions.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent Sessions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sessions.map((session) => (
            <SidebarMenuItem key={session.id}>
              <SidebarMenuButton asChild>
                <Link
                  className="flex items-center justify-between gap-3"
                  href={`/session/id/${session.shareId}`}
                >
                  <span>{session.title}</span>
                  <SessionMenu session={session} />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
