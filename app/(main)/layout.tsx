import Navbar from "@/components/common/navbar";
import { api } from "@/convex/_generated/api";
import { preloadWithAuth } from "@/lib/preload-with-auth";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await preloadWithAuth(api.auth.getCurrentUser);

  return (
    <div className="flex h-screen flex-col md:min-h-0">
      <Navbar user={user} />
      {children}
    </div>
  );
}
