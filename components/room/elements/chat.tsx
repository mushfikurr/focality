import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scroller } from "@/components/ui/scroller";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ParticipantsPopover } from "./participants-inline-modal";

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
}

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  disabled: boolean;
  isParticipantsOpen: boolean;
  setIsParticipantsOpen: (isOpen: boolean) => void;
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
      className="py-1"
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

export function Chat({
  messages,
  onSendMessage,
  disabled,
  isParticipantsOpen,
  setIsParticipantsOpen,
  participants,
}: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null); // Ref for the last message

  useEffect(() => {
    // Scroll the last message into view when messages change
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollTo({ behavior: "smooth" });
    }
  }, [messages, lastMessageRef]);

  return (
    <div className={cn("relative flex h-full flex-col gap-2 shadow-xs")}>
      {/* Participants Inline Modal */}
      <ParticipantsPopover
        setIsParticipantsOpen={setIsParticipantsOpen}
        isParticipantsOpen={isParticipantsOpen}
        participants={participants}
      />

      <div className="flex-1 overflow-hidden">
        <Scroller
          className={cn("h-full max-h-full overflow-auto")}
          ref={scrollRef}
        >
          <div
            className={cn(
              "h-full flex-1 space-y-2 overflow-y-auto border px-3 py-2 text-sm opacity-100 transition-opacity duration-300 ease-out",
              disabled && "border-muted opacity-70",
            )}
          >
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <p
                  key={msg.id}
                  className="text-muted-foreground"
                  ref={index === messages.length - 1 ? lastMessageRef : null} // Set ref to the last message
                >
                  <strong className="text-card-foreground">
                    {msg.sender}:
                  </strong>{" "}
                  {msg.content}
                </p>
              ))
            ) : (
              <>
                <p className="">
                  Welcome to <span className="italic">focality</span>. Get
                  started by adding a task, and start your focus session.
                </p>
                <p className="text-muted-foreground">
                  You can invite others to join your session by sending them the
                  link or the room ID.
                </p>
                <p className="text-muted-foreground">
                  The chat will be disabled when you start a session.
                </p>
              </>
            )}
          </div>
        </Scroller>
      </div>

      <ChatInput onSendMessage={onSendMessage} disabled={disabled} />
    </div>
  );
}
