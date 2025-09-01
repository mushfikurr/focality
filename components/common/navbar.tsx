"use client";

import { cn } from "@/lib/utils";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import UserNavbar, { UserTriggerSkeleton } from "./user-navbar";
import { Focus, LogIn } from "lucide-react";

export default function Navbar({ className }: { className?: string }) {
  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b py-2 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-secondary-foreground">
          <Focus className="h-5 w-5" />
        </Link>
        <AuthLoading>
          <UserTriggerSkeleton />
        </AuthLoading>
        <Authenticated>
          <UserNavbar />
        </Authenticated>
        <Unauthenticated>
          <div className="flex gap-2">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Register
            </Link>
          </div>
        </Unauthenticated>
      </div>
    </header>
  );
}
