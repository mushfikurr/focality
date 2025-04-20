import { Doc } from "@/convex/_generated/dataModel";
import { Clock, Crown, Flame, Star, Trophy, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

type User = Doc<"users">;

export default function UserAvatar({ user }: { user: User }) {
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar className="h-7 w-7 rounded-none border shadow-sm">
          <AvatarImage src={user.image} />
          <AvatarFallback className="h-full w-full rounded-none">
            {user.name?.[0] ?? "A"}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="bg-popover max-w-xl shadow-md">
        <UserCard user={user} />
      </PopoverContent>
    </Popover>
  );
}

export function UserCard({ user }: { user: User }) {
  return (
    <div className="flex flex-col">
      {/* Header with background */}
      <div className="rounded-t-lg p-0">
        <div className="flex gap-2.5">
          <Avatar className="h-14 w-14 rounded-none border shadow-xs">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="rounded-none">
              {user.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              {/* {user.isHost && ( */}

              {/* )} */}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className={`bg-primary h-2 w-2`}></span>
              <span className="text-muted-foreground text-sm">Working</span>
            </div>
            {/* {user.role && (
                <div className="mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              )} */}
          </div>
          <Badge
            variant="outline"
            className="flex h-5 items-center gap-1 border-amber-500/20 bg-amber-500/10 px-1.5 text-amber-500"
          >
            <Crown className="h-3 w-3" />
            <span className="text-xs">Host</span>
          </Badge>
        </div>
      </div>

      {/* User stats */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 py-4">
        <div className="col-span-1 flex items-center gap-3">
          <div className="bg-primary/10 border-primary/20 flex h-8 w-8 items-center justify-center border shadow-sm">
            <Clock className="icon-primary text-primary h-4 w-4" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Focus</p>
            <p className="font-medium">{"0h 0m"}</p>
          </div>
        </div>
        <div className="col-span-1 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-amber-500/20 bg-amber-500/10 shadow-sm">
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Streak</p>
            <p className="font-medium">{0} days</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-purple-500/20 bg-purple-500/10 shadow-sm">
            <Star className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Level</p>
            <p className="font-medium">{1}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-blue-500/20 bg-blue-500/10 shadow-sm">
            <Trophy className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">XP</p>
            <p className="font-medium">{0} XP</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Action buttons */}
      <div className="flex gap-3 pt-3">
        <Button variant="outline" size="sm" className="w-full">
          <User2 />
          View Profile
        </Button>
      </div>
    </div>
  );
}
