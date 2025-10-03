import { buttonVariants } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/data/server/token";
import { cn } from "@/lib/utils";
import { fetchQuery } from "convex/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const token = await getToken();
  const user = await fetchQuery(api.auth.getCurrentUser, {}, { token });

  return (
    <div className="h-full">
      <main className="container mx-auto flex min-h-full flex-col pt-4 pb-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-semibold tracking-tight">
              Welcome
              <span className="text-muted-foreground">
                {user?.name ? " " + user?.name : ""},
              </span>
            </h1>
            <p className="text-muted-foreground">
              here's an overview of your focus recently
            </p>
          </div>
          <Link
            href="/session/new"
            className={cn("flex items-center gap-2", buttonVariants({}))}
          >
            <Plus className="h-4 w-4" />
            <span>New Session</span>
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
