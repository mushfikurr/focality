import { Users2 } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Section from "./section";

export default function PariticpantList() {
  return (
    <Section header={{ title: "Participants", icon: Users2 }} hasBorder={true}>
      <MemberCard />
      <MemberCard />
      <MemberCard />
    </Section>
  );
}

function MemberCard() {
  const names = ["Charlie", "Alice", "Bob"];
  const name = names[Math.floor(Math.random() * names.length)];

  return (
    <div className="bg-card text-card-foreground flex items-center border-b last:border-b-0">
      <Avatar className="outline-border flex aspect-square h-full items-center justify-center rounded-none outline-1">
        <AvatarFallback className="rounded-none">{name[0]}</AvatarFallback>
      </Avatar>
      <div className="w-full px-3">{name}</div>
    </div>
  );
}
