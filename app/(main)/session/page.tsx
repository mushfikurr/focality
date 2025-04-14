"use client";

import { LocalPomodoroProvider } from "@/components/providers/LocalPomodoroProvider";
import Room from "@/components/room/room";
import Stats from "@/components/stats/stats";
import Tasks from "@/components/tasks/tasks";
import { LocalTimer } from "@/components/timer/elements/local-timer";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SessionPage() {
  const auth = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/session/new");
    }
  }, [auth.isAuthenticated, router]);

  if (auth.isAuthenticated) {
    return;
  }

  if (!auth.isAuthenticated) {
    return (
      <LocalPomodoroProvider>
        <div className="container mx-auto grid min-h-0 flex-1 grid-cols-1 gap-6 py-8 lg:grid-cols-3">
          <section className="col-span-1 flex min-h-0 flex-col gap-y-8 lg:col-span-2">
            <div className="shrink-0">
              <LocalTimer />
            </div>
            <div className="min-h-0 flex-1">
              <Tasks />
            </div>
          </section>
          <section className="flex flex-col gap-y-8 lg:col-span-1">
            <div className="shrink-0">
              <Room />
            </div>

            <div className="min-h-0 flex-1">
              <Stats />
            </div>
          </section>
        </div>
      </LocalPomodoroProvider>
    );
  }
}
