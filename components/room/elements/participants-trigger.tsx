import UserAvatar from "@/components/common/user-avatar";
import { Toggle } from "@/components/ui/toggle";
import { Doc } from "@/convex/_generated/dataModel";
import { Users } from "lucide-react";

type Participant = Doc<"users">;

interface ParticipantsTriggerProps {
  participants?: Participant[];
  setIsParticipantsOpen: (isOpen: boolean) => void;
  isParticipantsOpen: boolean;
}

export default function ParticipantsTrigger({
  participants,
  setIsParticipantsOpen,
  isParticipantsOpen,
}: ParticipantsTriggerProps) {
  return (
    <div className="flex h-full items-center gap-1">
      {participants
        ?.slice(0, 3)
        .map((p) => <UserAvatar key={p._id} user={p} />)}
      <Toggle
        variant="outline"
        onPressedChange={(val) => setIsParticipantsOpen(val)}
        pressed={isParticipantsOpen}
        className="h-7 w-7 px-0"
      >
        <Users />
      </Toggle>
    </div>
  );
}
