import Navbar from "@/components/common/navbar";
import { AppSidebar } from "@/components/common/sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { preloadUser } from "@/lib/data/server/preload-user";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await preloadUser();

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
