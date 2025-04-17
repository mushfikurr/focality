import { UserCard } from "@/components/common/user-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Crown,
  MessageCircle,
  MoreHorizontal,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function ParticipantsList({
  participants,
}: {
  participants: Doc<"users">[];
}) {
  return (
    <>
      {participants.map((p) => (
        <Popover modal={false} key={p._id}>
          <PopoverTrigger className="w-full">
            <Participant user={p} />
          </PopoverTrigger>
          <PopoverContent align="start">
            <UserCard user={p} />
          </PopoverContent>
        </Popover>
      ))}
    </>
  );
}

const Participant = ({ user }: { user: Doc<"users"> }) => {
  return (
    <div
      key={user._id}
      className="hover:bg-secondary/50 flex cursor-pointer items-center justify-between rounded-md border p-2 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="border-border h-8 w-8 rounded-none border">
            <AvatarImage
              src={user.image || "/placeholder.svg"}
              alt={user.name}
            />
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
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
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
