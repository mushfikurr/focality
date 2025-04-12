import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import { Timer } from "@/components/sample-timer";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowRight, Medal, TimerIcon, Users2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="container mx-auto flex grow flex-col">
          <section className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="mb-6 space-y-4">
              <h1 className="text-center text-3xl leading-[1.1] font-bold tracking-tight">
                Stay productive together
              </h1>
              <p className="text-muted-foreground max-w-prose text-center text-lg text-balance">
                Help you stay focused and accountable with others.
              </p>
            </div>
            <div className="w-full max-w-2xl">
              <Suspense
                fallback={<Skeleton className="mb-8 h-[162px] w-full" />}
              >
                <Timer />
              </Suspense>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">How it works</Button>
              <Link
                href="/session"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Start session <ArrowRight />
              </Link>
            </div>
          </section>

          <section className="flex items-center justify-center gap-4 md:flex-col">
            <div className="flex w-full max-w-3xl flex-col gap-3 md:flex-row">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="mb-2 flex items-center gap-3">
                    <TimerIcon className="text-primary h-4 w-4" /> Focus
                  </CardTitle>
                  <CardDescription>
                    Trackable Pomodoro sessions to maximize productivity.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="mb-2 flex items-center gap-3">
                    <Users2 className="text-primary h-4 w-4" /> Work Rooms
                  </CardTitle>
                  <CardDescription>
                    Join virtual rooms to work alongside others in real-time.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="mb-2 flex items-center gap-3">
                    <Medal className="text-primary h-4 w-4" /> XP & Leaderboards
                  </CardTitle>{" "}
                  <CardDescription>
                    Earn points and climb the leaderboard as you complete
                    sessions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
