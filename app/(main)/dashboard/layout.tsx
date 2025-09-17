import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto pt-4 pb-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-semibold">Session Management</h1>
            <p className="text-muted-foreground text-sm">
              Track, analyze, and create your focus sessions
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
