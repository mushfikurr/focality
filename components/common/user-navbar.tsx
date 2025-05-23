"use client";

import { useQuery } from "convex/react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { api } from "@/convex/_generated/api";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, Moon, Sun } from "lucide-react";
import { forwardRef, useRef } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useTheme } from "next-themes";

export default function UserNavbar() {
  const auth = useAuthActions();
  const userNavRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const handleLogout = async () => {
    await auth.signOut();
    toast.success("Successfully logged out!");
    redirect("/");
  };

  const handleThemeChange = () => {
    theme.setTheme(theme.theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex space-x-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-full py-0 pr-0">
            <UserTrigger ref={userNavRef} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mt-1 -mr-1">
          <DropdownMenuLabel className="text-xs">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut /> Log out
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleThemeChange}>
            {theme.theme === "light" ? <Sun /> : <Moon />} Switch Theme
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const UserTrigger = forwardRef(() => {
  const currentUser = useQuery(api.user.currentUser);

  return (
    <div className="flex h-full flex-row-reverse items-center gap-4">
      <Avatar className="flex aspect-square h-full items-center justify-center rounded-none border border-t-0 border-r-0 border-b-0">
        <AvatarImage
          className="aspect-square h-full"
          src={currentUser?.image}
        />
        <AvatarFallback>{currentUser?.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <p className="text-xs font-semibold">{currentUser?.name}</p>
      </div>
    </div>
  );
});

export const UserTriggerSkeleton = () => {
  return (
    <Skeleton className="outline-border aspect-square w-[32px] outline-1" />
  );
};
