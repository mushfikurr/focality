"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AnimatedTabsTrigger, Tabs, TabsContent, TabsList } from "../ui/tabs";
import { Chat } from "./elements/chat";
import ParticipantsList from "./elements/participants-list";

import { Users } from "lucide-react";
import { MessageSquareMoreIcon } from "../ui/animated-icons/message-square-more";
import { UsersIcon } from "../ui/animated-icons/users-2";

interface SyncedRoomProps {
  preloadedRoom: Preloaded<typeof api.rooms.queries.getRoomBySession>;
  preloadedParticipants: Preloaded<typeof api.rooms.queries.listParticipants>;
  preloadedChat: Preloaded<typeof api.chat.queries.listChatMessages>;
  preloadedSession: Preloaded<typeof api.session.queries.getSession>;
  preloadedUser: Preloaded<typeof api.user.currentUser>;
}

export function SyncedRoom(props: SyncedRoomProps) {
  const {
    preloadedUser,
    preloadedParticipants,
    preloadedRoom,
    preloadedChat,
    preloadedSession,
  } = props;
  const participants = usePreloadedQuery(preloadedParticipants);
  const room = usePreloadedQuery(preloadedRoom);
  const chatMessages = usePreloadedQuery(preloadedChat);
  const session = usePreloadedQuery(preloadedSession);
  const user = usePreloadedQuery(preloadedUser);
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

  if (!room) return null;

  const sendChatMessage = useMutation(api.chat.mutations.createChat);
  const onSendMessage = (message: string) => {
    sendChatMessage({ roomId: room._id, content: message });
  };

  const joinRoomMtn = useMutation(api.rooms.mutations.joinRoom);
  // TODO: Create actual joining mechanism, this is for now.
  useEffect(() => {
    joinRoomMtn({ roomId: room._id });
  }, []);

  return (
    <Tabs defaultValue="chat" className="flex h-full flex-col">
      <TabsList className="shadow-sm">
        <AnimatedTabsTrigger value="chat" icon={<MessageSquareMoreIcon />}>
          Chat
        </AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="participants" icon={<UsersIcon />}>
          Participants
        </AnimatedTabsTrigger>
      </TabsList>
      <TabsContent value="chat" className="flex-1 overflow-hidden shadow-sm">
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle>
              <h1>Session Chat</h1>
            </CardTitle>
          </CardHeader>
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
          <CardHeader>
            <CardTitle className="flex justify-between gap-2">
              Participants
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" /> {participants.length}
              </p>
            </CardTitle>
          </CardHeader>
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
