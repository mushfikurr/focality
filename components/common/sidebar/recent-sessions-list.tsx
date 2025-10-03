"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SessionMenu } from "./session-menu";
import { JoinSessionButton } from "@/components/session/join-session-button";
import { Id } from "@/convex/_generated/dataModel";

interface Session {
  id: string;
  shareId: string;
  title: string;
}

interface RecentSessionsListProps {
  sessions?: Session[];
}

export function RecentSessionsList({ sessions }: RecentSessionsListProps) {
  if (!sessions || sessions?.length === 0) return null;

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <button className="cursor-pointer">
            <SidebarGroupLabel className="hover:text-foreground flex items-center justify-between transition-colors duration-150">
              Recent Sessions
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </SidebarGroupLabel>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {sessions.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <JoinSessionButton
                    session={{
                      title: session.title,
                      _id: session.id as Id<"sessions">,
                      shareId: session.shareId,
                    }}
                    asChild
                    className="flex items-center justify-between gap-3"
                  >
                    <SidebarMenuButton>
                      <span>{session.title}</span>
                      <SessionMenu session={session} />
                    </SidebarMenuButton>
                  </JoinSessionButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
