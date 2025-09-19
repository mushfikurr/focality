"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

export function SidebarLayoutProvider({
  children,
}: { 
  children: React.ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
}