"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { LogOut, Moon, Sun, User2 } from "lucide-react";
import { useTheme } from "next-themes";
import { redirect, useRouter } from "next/navigation";
import { forwardRef, useRef } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { getLevelFromXP } from "@/lib/client-level";
import { Badge } from "../ui/badge";

export default function UserNavbar({ user }: { user: Doc<"users"> }) {
  const router = useRouter();
  const userNavRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const handleLogout = async () => {
    toast.success("Successfully logged out!");
    await authClient.signOut();
    router.push("/login");
  };

  const handleThemeChange = () => {
    theme.setTheme(theme.theme === "dark" ? "light" : "dark");
  };

  const handleProfile = () => {
    if (!user) toast.error("Unable to find user profile.");
    redirect(`/profile/${user?._id}`);
  };

  return (
    <div className="flex space-x-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-mx-3 h-full py-0.5">
            <UserTrigger user={user} ref={userNavRef} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mt-1 -mr-1">
          <DropdownMenuLabel className="text-xs">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfile}>
            <User2 /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleThemeChange}>
            {theme.theme === "light" ? <Sun /> : <Moon />} Switch Theme
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface UserTriggerProps {
  user: Doc<"users">;
}

const UserTrigger = forwardRef<HTMLDivElement, UserTriggerProps>(
  ({ user }, ref) => {
    const level = getLevelFromXP(user.xp ?? 0);
    return (
      <div ref={ref} className="flex h-full items-center gap-3 py-0.5">
        <Avatar className="flex aspect-square h-6 w-6 items-center justify-center rounded">
          <AvatarImage className="aspect-square h-full" src={user.image} />
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <p className="text-xs font-semibold">{user.name}</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Level {level}
        </Badge>
      </div>
    );
  },
);
export const UserTriggerSkeleton = () => {
  return <Skeleton className="aspect-square w-[32px] outline-1" />;
};
