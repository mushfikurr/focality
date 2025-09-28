import Navbar from "@/components/common/navbar";
import { AppSidebar } from "@/components/common/sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { preloadUser } from "@/lib/data/server/preload-user";
import { preloadWithAuth } from "@/lib/preload-with-auth";
import { api } from "@/convex/_generated/api";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await preloadUser();
  const preloadedSessions = await preloadWithAuth(api.session.queries.getRecentSessionsForUser);

  return (
    <SidebarProvider>
      <AppSidebar preloadedSessions={preloadedSessions} />
      <SidebarInset>
        <div className="flex h-screen flex-col md:min-h-0">
          <Navbar user={user} />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
