"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { AnimatedTabsTrigger, Tabs, TabsContent, TabsList } from "../ui/tabs";
import { Chat } from "./elements/chat";
import ParticipantsList from "./elements/participants-list";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { MessageSquareMoreIcon } from "../ui/animated-icons/message-square-more";
import { UsersIcon } from "../ui/animated-icons/users-2";

interface SyncedRoomProps {
  preloadedParticipants: Preloaded<typeof api.session.queries.listParticipants>;
  preloadedChat: Preloaded<typeof api.chat.queries.listChatMessages>;
  preloadedSession: Preloaded<typeof api.session.queries.getSession>;
  preloadedUser: Preloaded<typeof api.user.currentUser>;
}

export function SyncedRoom(props: SyncedRoomProps) {
  const {
    preloadedUser,
    preloadedParticipants,
    preloadedChat,
    preloadedSession,
  } = props;
  const participants = usePreloadedQuery(preloadedParticipants);
  const chatMessages = usePreloadedQuery(preloadedChat);
  const session = usePreloadedQuery(preloadedSession);
  const user = usePreloadedQuery(preloadedUser);
  const router = useRouter();
  const messages = chatMessages.filter(Boolean).map((m) => {
    if (m.sender?._id === user?._id) {
      return {
        id: m?._id as string,
        content: m?.content as string,
        sender: "You",
      };
    } else {
      return {
        id: m?._id as string,
        content: m?.content as string,
        sender: m.sender?.name as string,
      };
    }
  });

  if (!session) return null;

  const sendChatMessage = useMutation(api.chat.mutations.createChat);
  const onSendMessage = (message: string) => {
    sendChatMessage({ sessionId: session.session._id, content: message });
  };

  const joinSessionMtn = useMutation(api.session.mutations.joinSession);
  const leaveSessionMtn = useMutation(api.session.mutations.leaveSession);

  useEffect(() => {
    joinSessionMtn({ sessionId: session.session._id });

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      leaveSessionMtn({ sessionId: session.session._id });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleLeaveSession = () => {
    leaveSessionMtn({ sessionId: session.session._id });
    router.push("/dashboard");
  };

  return (
    <Tabs defaultValue="chat" className="flex h-full flex-col">
      <div className="flex justify-between">
        <TabsList>
          <AnimatedTabsTrigger value="chat" icon={<MessageSquareMoreIcon />}>
            Chat
          </AnimatedTabsTrigger>
          <AnimatedTabsTrigger value="participants" icon={<UsersIcon />}>
            Participants
          </AnimatedTabsTrigger>
        </TabsList>
        <Button variant="outline" size="icon" onClick={handleLeaveSession}>
          <LogOut />
        </Button>
      </div>
      <TabsContent value="chat" className="flex-1 overflow-hidden shadow-sm">
        <Card className="flex h-full flex-col rounded-xl border">
          <CardContent className="flex-1 overflow-hidden">
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto">
                <Chat
                  onSendMessage={onSendMessage}
                  messages={messages}
                  participants={participants}
                  disabled={session.session.running}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent
        value="participants"
        className="flex-1 overflow-hidden shadow-sm"
      >
        <Card className="flex h-full flex-col">
          <CardContent className="flex-1 overflow-hidden">
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto">
                <ParticipantsList participants={participants} />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
