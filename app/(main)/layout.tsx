import { AppSidebar } from "@/components/common/sidebar/sidebar";
import Navbar from "@/components/common/navbar";
import { SidebarLayoutProvider } from "@/components/providers/SidebarLayoutProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { preloadWithAuth } from "@/lib/preload-with-auth";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await preloadWithAuth(api.auth.getCurrentUser);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col md:min-h-0">
          <Navbar user={user} />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
