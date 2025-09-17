"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto -mt-9 flex w-full max-w-2xl grow flex-col justify-center space-y-6 pb-8">
      <h1 className="text-4xl">:(</h1>
      <div className="space-y-2">
        <h2>Error joining session</h2>
        <p className="text-muted-foreground">
          Error: {error.digest} {error.message}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={reset}>Retry</Button>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href="/dashboard"
        >
          <ArrowLeft /> Back to dashboard
        </Link>
      </div>
    </div>
  );
}
