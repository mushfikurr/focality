import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";
import { Doc } from "@/convex/_generated/dataModel";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  disabled: boolean;
  participants: Doc<"users">[];
}

function ChatInput({
  onSendMessage,
  disabled,
}: {
  disabled: boolean;
  onSendMessage: (message: string) => void;
}) {
  const [message, setMessage] = useState("");

  const handleSendClick = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSendClick();
      }}
    >
      <div className="flex w-full items-center gap-2">
        <Input
          type="text"
          placeholder="Type a message"
          className="grow"
          value={message}
          disabled={disabled}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" disabled={disabled} variant="outline" size="icon">
          <Send />
        </Button>
      </div>
    </form>
  );
}

export function Chat({ messages, onSendMessage, disabled }: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null); // Ref for the last message

  useEffect(() => {
    // Scroll the last message into view when messages change
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollTo({ behavior: "smooth" });
    }
  }, [messages, lastMessageRef]);

  return (
    <div className="flex h-full flex-col gap-2 p-6">
      <ScrollArea className="bg-secondary border-secondary h-full space-y-2 overflow-auto rounded-md border px-3 py-2 text-sm">
        {messages.length > 0 ? (
          messages.map((m) => <Message key={m.id} message={m} />)
        ) : (
          <EmptyChat />
        )}
      </ScrollArea>
      <ChatInput onSendMessage={onSendMessage} disabled={disabled} />
    </div>
  );
}

function Message({ message }: { message: ChatMessage }) {
  return (
    <div className="flex gap-1">
      <p className="font-semibold">{message.sender}:</p>
      <p>{message.content}</p>
    </div>
  );
}

function EmptyChat() {
  return (
    <div className="text-muted-foreground space-y-2">
      <p className="text-foreground font-semibold">
        Welcome to <span className="italic">focality</span>!
      </p>
      <p>
        Chats will appear here. When a task is started, the chat will
        temporarily pause to allow you to focus on the task.
      </p>
      <p>
        If you are the host, start by adding a task, and then click start to
        begin focusing on your work.
      </p>
      <p>
        Invite others by sharing the link of this page with them. You can also
        grab the room code from the Participants section.
      </p>
      <p>Good luck, and remember to start small.</p>
    </div>
  );
}
