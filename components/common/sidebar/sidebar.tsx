import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Compass, Focus, LayoutDashboard, Plus, User2 } from "lucide-react";

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

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-2 pb-0">
          <SidebarMenuButton variant="outline">
            <Plus /> New Session
          </SidebarMenuButton>
        </div>
        <SidebarNav />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
