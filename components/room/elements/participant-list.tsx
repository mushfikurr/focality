import { Users2 } from "lucide-react";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import Section from "./section";

interface Participant {
  id: string;
  name: string;
}

interface ParticipantListProps {
  participants?: Participant[];
}

export default function ParticipantList({
  participants,
}: ParticipantListProps) {
  return (
    <Section header={{ title: "Participants", icon: Users2 }} hasBorder={true}>
      {participants && participants.length > 0 ? (
        participants?.map((participant) => (
          <MemberCard key={participant.id} name={participant.name} />
        ))
      ) : (
        <p>No participants yet.</p>
      )}
    </Section>
  );
}

function MemberCard({ name }: { name: string }) {
  return (
    <div className="bg-card text-card-foreground flex items-center border-b last:border-b-0">
      <Avatar className="outline-border flex aspect-square h-full items-center justify-center rounded-none outline-1">
        <AvatarFallback className="rounded-none">{name[0]}</AvatarFallback>
      </Avatar>
      <div className="w-full px-3">{name}</div>
    </div>
  );
}
