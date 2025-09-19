import { api } from "@/convex/_generated/api";
import { Preloaded } from "convex/react";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Compass, LayoutDashboard, User2 } from "lucide-react";

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

function SidebarNav() {
  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.groupTitle}>
          <SidebarGroupLabel>{group.groupTitle}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}

export function AppSidebar({
  user,
}: {
  user: Preloaded<typeof api.auth.getCurrentUser>;
}) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
