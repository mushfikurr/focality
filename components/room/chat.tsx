import { MessageSquare, Send } from "lucide-react";
import Section from "./section";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function ChatInput() {
  return (
    <div className="flex w-full items-center gap-3 p-3">
      <Input type="text" placeholder="Type a message" className="grow" />
      <Button variant="outline" size="icon">
        <Send />
      </Button>
    </div>
  );
}

export function Chat() {
  return (
    <Section
      header={{ title: "Chat", icon: MessageSquare }}
      hasBorder={true}
      bottom={<ChatInput />}
    >
      <div className="bg-card flex h-full flex-col px-3 leading-loose">
        <p>Hello</p>
        <p>Hello</p>
        <p>Hello</p>
        <p>Hello</p>
        <p>Hello</p>
        <p>Hello</p>
        <p>Hello</p>
        <p>Hello</p>
        <p>Hello</p>
        <p>Hello</p>
      </div>
    </Section>
  );
}
