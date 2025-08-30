import { UserCard } from "@/components/common/user-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { MessageCircle, MoreHorizontal, Volume2, VolumeX } from "lucide-react";

export default function ParticipantsList({
  participants,
}: {
  participants: Doc<"users">[];
}) {
  return (
    <ScrollArea className="h-full w-full overflow-auto">
      {participants.map((p, idx) => (
        <HoverCard key={p._id}>
          <HoverCardTrigger className="w-full">
            <Participant
              user={p}
              className={cn(idx === participants.length - 1 && "border-b")}
            />
          </HoverCardTrigger>
          <HoverCardContent align="start">
            <UserCard user={p} />
          </HoverCardContent>
        </HoverCard>
      ))}
    </ScrollArea>
  );
}

const Participant = ({
  user,
  className,
}: {
  user: Doc<"users">;
  className?: string;
}) => {
  return (
    <div
      key={user._id}
      className={cn(
        "hover:bg-secondary/50 flex cursor-pointer items-center justify-between rounded-md border border-b-0 p-2 transition-colors",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="border-border h-8 w-8 border">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>
              {user.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* <span
            className={`border-background absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 ${getStatusColor(
              user.status
            )}`}
          ></span> */}
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{user.name}</span>
            {/* {user.isHost && <Crown className="h-3 w-3 text-amber-500" />} */}
          </div>
          {/* <div className="text-muted-foreground text-xs">
            {user.status === "online"
              ? "Active now"
              : `Last active ${formatLastActive(user.lastActive)}`}
          </div> */}
        </div>
      </div>
      <div className="flex items-center">
        <ParticipantDropdown />
      </div>
    </div>
  );
};

const ParticipantDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            buttonVariants({ size: "icon", variant: "outline" }),
            "h-8 w-8",
          )}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <MessageCircle className="mr-2 h-4 w-4" />
          Message
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Volume2 className="mr-2 h-4 w-4" />
          Call
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <VolumeX className="mr-2 h-4 w-4" />
          Mute
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
