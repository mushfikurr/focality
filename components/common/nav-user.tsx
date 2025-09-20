"use client";
import { api } from "@/convex/_generated/api";
import { authClient, errorMap, handleError } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Preloaded, usePreloadedQuery } from "convex/react";
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
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
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
import { useRouter } from "next/navigation";

type NavUserProps = {
  user: Preloaded<typeof api.auth.getCurrentUser>;
};

export function NavUser({ user: preloadedUser }: NavUserProps) {
  const user = usePreloadedQuery(preloadedUser);
  const router = useRouter();
  if (!user) return;

  const theme = useTheme();

  const handleThemeChange = (newTheme: string) => {
    theme.setTheme(newTheme);
  };

  const handleLogout = async () => {
    const signInPromise = (async () => {
      const { data, error } = await authClient.signOut();
      if (error) {
        const message = handleError(error.code, errorMap);
        throw new Error(message);
      }
      return data;
    })();

    toast.promise(signInPromise, {
      loading: "Logging out...",
      success: "Successfully logged out",
      error: (err) => err.message,
    });
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-5">
          <Avatar
            className={cn(user.sessionId && "drop-shadow-green-500", "h-7 w-7")}
          >
            <AvatarImage src={user.image} alt="Users avatar" />
            <AvatarFallback>{user.name?.charAt(0) ?? " "}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-w-72 min-w-64"
        side="bottom"
        sideOffset={8}
        align="end"
      >
        <DropdownMenuGroup>
          <div className="text-muted-foreground text-sm">
            <DropdownMenuLabel className="flex items-center justify-between gap-2">
              <h1 className="truncate">{user.name}</h1>
              {user.sessionId && <Badge>In Session</Badge>}
            </DropdownMenuLabel>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
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
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
