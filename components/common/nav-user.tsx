"use client";
import { api } from "@/convex/_generated/api";
import { authClient, errorMap, handleError } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import {
  Cog,
  DoorOpen,
  Loader2,
  LogOut,
  MonitorCog,
  Moon,
  Paintbrush,
  Sun,
  Target,
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
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { Skeleton } from "../ui/skeleton";

type NavUserProps = {
  user: typeof api.auth.getCurrentUser._returnType;
};

export function NavUser({ user }: NavUserProps) {
  const router = useRouter();

  if (!user) return <UserAvatarSkeleton />;

  const handleLogout = async () => {
    const signInPromise = (async () => {
      const { data, error } = await authClient.signOut();
      if (error) {
        const message = handleError(error.code, errorMap);
        throw new Error(message);
      }
      router.push("/login");
      return data;
    })();

    toast.promise(signInPromise, {
      loading: "Logging out...",
      success: "Successfully logged out",
      error: (err) => err.message,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative flex items-center gap-5">
          {!user && <UserAvatarSkeleton />}
          <Avatar className={cn("h-7 w-7")}>
            <AvatarImage src={user.image} alt="Users avatar" />
            <AvatarFallback>{user.name?.charAt(0) ?? " "}</AvatarFallback>
          </Avatar>
          {user.sessionId && (
            <UserAvatarSessionIndicator sessionId={user.sessionId} />
          )}
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
        {user.sessionId && <DropdownSessionGroup sessionId={user.sessionId} />}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User2 /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Cog /> Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownPreferenceGroup />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const UserAvatarSkeleton = () => {
  return <Skeleton className="h-7 w-7 rounded-full"></Skeleton>;
};

function UserAvatarSessionIndicator({
  sessionId,
}: {
  sessionId: Id<"sessions">;
}) {
  const { data, isPending, error } = useQuery(
    convexQuery(api.session.queries.getSession, { sessionId }),
  );

  if (isPending || error || !data) return null;
  const session = data.session;
  const running = session.running;

  return (
    <div
      className={cn(
        running && "drop-shadow-active bg-green-500",
        !running && "drop-shadow-inactive bg-amber-500",
        "absolute right-0 bottom-0 h-2 w-2 rounded-full",
        "transition-colors duration-300 ease-out",
      )}
    ></div>
  );
}

function DropdownPreferenceGroup() {
  const theme = useTheme();
  const handleThemeChange = (newTheme: string) => {
    theme.setTheme(newTheme);
  };

  return (
    <>
      <DropdownMenuLabel>Preferences</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger arrowLeft className="flex items-center gap-2">
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
    </>
  );
}

function DropdownSessionGroup({ sessionId }: { sessionId: Id<"sessions"> }) {
  const { data, isPending, error } = useQuery(
    convexQuery(api.session.queries.getSession, { sessionId }),
  );
  const router = useRouter();

  const { mutate: leaveMutation, isPending: isLeaveMtnPending } = useMutation({
    mutationFn: useConvexMutation(api.session.mutations.leaveSession),
  });

  const handleSessionLeave = () => {
    leaveMutation({ sessionId });
  };

  const handleSessionGo = () => {
    if (data) {
      router.push(`/session/id/${data.session.shareId}`);
    }
  };

  if (isPending) {
    return (
      <>
        <Skeleton className="h-8 w-full px-2 py-1.5" />
        <DropdownMenuSeparator />
      </>
    );
  }

  if (error) {
    return null;
  }

  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel>Focus Session</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleSessionGo}>
          <Target /> Go to
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSessionLeave}>
          {isLeaveMtnPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <DoorOpen />
          )}
          Leave
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
    </>
  );
}
