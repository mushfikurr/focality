import Footer from "@/components/common/footer";
import ProductDemoImage from "@/components/product-demo-image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <div className="container flex min-h-screen flex-col">
        <main className="mx-auto mt-8 flex w-full max-w-prose flex-col items-center px-4 py-16 pt-8 md:px-8">
          <section className="space-y-3">
            <h1 className="mb-4 text-xl font-semibold">
              Focality - A multiplayer pomodoro timer
            </h1>
            <p className="text-muted-foreground">
              Structure your time with focused work sessions that keep you on
              track.
            </p>
            <p className="text-muted-foreground">
              Team up with friends or connect globally to stay accountable and
              get things done.
            </p>
            <p className="text-muted-foreground">
              Earn progress for every block you complete and climb the
              leaderboards as you level up.
            </p>
            <Link className={cn(buttonVariants(), "mt-4")} href="/dashboard">
              Start focusing
            </Link>
          </section>
        </main>
        <div className="relative w-full grow">
          <ProductDemoImage />
        </div>
      </div>
      <Footer />
    </>
  );
}
