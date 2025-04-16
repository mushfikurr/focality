import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import UserAvatar from "@/components/common/user-avatar";

type Participant = Doc<"users">;

interface ParticipantListProps {
  participants?: Participant[];
}

export default function ParticipantList({
  participants,
}: ParticipantListProps) {
  return (
    <div className="flex h-full items-center">
      {participants?.slice(0, 3).map((p) => <UserAvatar user={p} />)}
      <Button variant="outline" size="sm" className="h-7 w-7 border-l-0">
        <Users2 />
      </Button>
    </div>
  );
}
