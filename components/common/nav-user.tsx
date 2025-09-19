"use client";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Cog,
  LogOut,
  MonitorCog,
  Moon,
  Paintbrush,
  Sun,
  User2,
} from "lucide-react";
import { useTheme } from "next-themes";

type NavUserProps = {
  user: Preloaded<typeof api.auth.getCurrentUser>;
};

export function NavUser({ user: preloadedUser }: NavUserProps) {
  const user = usePreloadedQuery(preloadedUser);
  if (!user) return;

  const theme = useTheme();

  const handleThemeChange = (newTheme: string) => {
    theme.setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-7 w-7">
          <AvatarImage src={user.image} alt="Users avatar" />
          <AvatarFallback>{user.name?.charAt(0) ?? " "}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-w-72 min-w-56"
        side="bottom"
        sideOffset={8}
        align="end"
      >
        <DropdownMenuGroup>
          <div className="text-muted-foreground space-y-0">
            <DropdownMenuLabel className="truncate font-normal first:pb-0">
              {user.name}
            </DropdownMenuLabel>
            <DropdownMenuLabel className="truncate pt-0 font-normal">
              {user.email}
            </DropdownMenuLabel>
            {user.sessionId && (
              <DropdownMenuLabel className="text-foreground truncate font-normal last:pt-0">
                In session
              </DropdownMenuLabel>
            )}
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User2 /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Cog /> Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              arrowLeft
              className="flex items-center gap-2"
            >
              <Paintbrush className="text-muted-foreground size-4" />
              Change Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={theme.theme}
                  onValueChange={handleThemeChange}
                >
                  <DropdownMenuRadioItem value="light">
                    <Sun /> Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <Moon /> Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <MonitorCog /> System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
