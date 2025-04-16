"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scroller } from "@/components/ui/scroller";
import { cn } from "@/lib/utils";
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

export function Chat({ messages, onSendMessage, disabled }: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className={cn("flex h-full flex-col gap-2")}>
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
            messages.map((msg) => (
              <p key={msg.id} className="text-muted-foreground">
                <strong className="text-card-foreground">{msg.sender}:</strong>{" "}
                {msg.content}
              </p>
            ))
          ) : (
            <>
              <p className="">
                Welcome to <span className="italic">focality</span>. Get started
                by adding a task, and start your focus session.
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
      <ChatInput onSendMessage={onSendMessage} disabled={disabled} />
    </div>
  );
}
